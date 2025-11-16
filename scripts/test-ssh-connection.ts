import { Client as SSHClient } from 'ssh2';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testSSHConnection() {
  console.log('🔍 Testing SSH connection to upload server...\n');

  const config = {
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT || '22', 10),
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD,
    privateKey: process.env.SSH_PRIVATE_KEY_PATH
      ? fs.readFileSync(process.env.SSH_PRIVATE_KEY_PATH)
      : undefined,
    remotePath: process.env.SSH_REMOTE_PATH || '/var/www/uploads',
  };

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Username: ${config.username}`);
  console.log(`  Auth Method: ${config.privateKey ? 'Private Key' : 'Password'}`);
  console.log(`  Remote Path: ${config.remotePath}\n`);

  if (!config.host || !config.username) {
    console.error('❌ Missing required configuration!');
    console.error('Please set SSH_HOST and SSH_USERNAME in .env file');
    process.exit(1);
  }

  if (!config.privateKey && !config.password) {
    console.error('❌ Missing authentication method!');
    console.error('Please set either SSH_PASSWORD or SSH_PRIVATE_KEY_PATH in .env file');
    process.exit(1);
  }

  return new Promise<void>((resolve, reject) => {
    const conn = new SSHClient();

    conn.on('ready', () => {
      console.log('✅ SSH connection established successfully!\n');

      // Test SFTP
      conn.sftp((err, sftp) => {
        if (err) {
          console.error('❌ SFTP error:', err.message);
          conn.end();
          return reject(err);
        }

        console.log('✅ SFTP session created successfully!\n');

        // Check if remote directory exists
        sftp.stat(config.remotePath, (statErr, stats) => {
          if (statErr) {
            console.log(`⚠️  Remote directory does not exist: ${config.remotePath}`);
            console.log('Attempting to create directory...\n');

            sftp.mkdir(config.remotePath, { mode: 0o755 }, (mkdirErr) => {
              if (mkdirErr) {
                console.error('❌ Failed to create directory:', mkdirErr.message);
                conn.end();
                return reject(mkdirErr);
              }

              console.log('✅ Directory created successfully!\n');
              testWritePermission(sftp, config.remotePath, conn, resolve, reject);
            });
          } else {
            console.log(`✅ Remote directory exists: ${config.remotePath}`);
            console.log(`   Permissions: ${stats.mode.toString(8)}\n`);
            testWritePermission(sftp, config.remotePath, conn, resolve, reject);
          }
        });
      });
    });

    conn.on('error', (err) => {
      console.error('❌ SSH connection error:', err.message);
      reject(err);
    });

    const connectionConfig: any = {
      host: config.host,
      port: config.port,
      username: config.username,
    };

    if (config.privateKey) {
      connectionConfig.privateKey = config.privateKey;
    } else if (config.password) {
      connectionConfig.password = config.password;
    }

    console.log('Connecting...\n');
    conn.connect(connectionConfig);
  });
}

function testWritePermission(
  sftp: any,
  remotePath: string,
  conn: SSHClient,
  resolve: () => void,
  reject: (err: Error) => void,
) {
  const testFile = `${remotePath}/test_upload_${Date.now()}.txt`;
  const testContent = Buffer.from('Test upload file - can be deleted');

  console.log('Testing write permission...');
  console.log(`Creating test file: ${testFile}\n`);

  const writeStream = sftp.createWriteStream(testFile, { mode: 0o644 });

  writeStream.on('error', (err: Error) => {
    console.error('❌ Write permission test failed:', err.message);
    conn.end();
    reject(err);
  });

  writeStream.on('close', () => {
    console.log('✅ Write permission test successful!\n');

    // Clean up test file
    sftp.unlink(testFile, (unlinkErr: Error) => {
      if (unlinkErr) {
        console.warn('⚠️  Could not delete test file:', unlinkErr.message);
      } else {
        console.log('✅ Test file cleaned up successfully!\n');
      }

      conn.end();
      console.log('🎉 All tests passed! Your SSH configuration is working correctly.\n');
      resolve();
    });
  });

  writeStream.write(testContent);
  writeStream.end();
}

// Run the test
testSSHConnection()
  .then(() => {
    console.log('✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Test failed:', err.message);
    console.error('\nPlease check:');
    console.error('1. SSH credentials are correct');
    console.error('2. Server is accessible from your network');
    console.error('3. SSH service is running on the server');
    console.error('4. Firewall allows SSH connections');
    console.error('5. User has write permission to the remote directory');
    process.exit(1);
  });

