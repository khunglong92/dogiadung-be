import { Prisma, ServiceStatus, ServiceThemeVariant } from '@prisma/client';

export const servicesSeedData: Prisma.ServiceCreateInput[] = [
  {
    slug: 'gia-cong-kim-loai-tam',
    title: 'Gia công kim loại tấm',
    subtitle: 'Giải pháp toàn diện cho sản phẩm kim loại',
    shortDescription:
      'Cung cấp dịch vụ gia công kim loại tấm theo yêu cầu với độ chính xác cao, đáp ứng mọi tiêu chuẩn kỹ thuật khắt khe nhất.',
    content: [
      'Với hệ thống máy móc hiện đại và đội ngũ kỹ sư giàu kinh nghiệm, chúng tôi tự hào là đơn vị hàng đầu trong lĩnh vực gia công kim loại tấm tại Việt Nam.',
      'Chúng tôi nhận gia công các sản phẩm từ thép, inox, nhôm, đồng... với các phương pháp đột dập, chấn gấp, soi rãnh, cắt laser, đảm bảo chất lượng và tiến độ.',
      'Quy trình sản xuất được kiểm soát chặt chẽ từ khâu nhập vật liệu đến khi giao hàng, mang đến cho khách hàng sự yên tâm tuyệt đối.',
    ],
    features: [
      'Hệ thống máy móc CNC hiện đại từ Nhật Bản, Đức.',
      'Đội ngũ kỹ sư, công nhân tay nghề cao.',
      'Quy trình kiểm soát chất lượng ISO 9001:2015.',
      'Nhận gia công đơn hàng số lượng lớn và cả đơn hàng nhỏ lẻ.',
    ],
    technologies: [
      'Công nghệ cắt Laser Fiber',
      'Máy chấn Amada-Nhật Bản',
      'Máy đột dập CNC',
      'Phần mềm thiết kế 3D chuyên dụng',
    ],
    benefits: [
      'Sản phẩm đạt độ chính xác tuyệt đối.',
      'Bề mặt sản phẩm tinh xảo, thẩm mỹ cao.',
      'Tiết kiệm chi phí và thời gian sản xuất.',
      'Tư vấn kỹ thuật và tối ưu hóa thiết kế miễn phí.',
    ],
    customers:
      'Các công ty xây dựng, nhà thầu cơ điện, xưởng sản xuất nội thất, doanh nghiệp quảng cáo.',
    imageUrls: [
      'https://picsum.photos/seed/metal-fabrication/800/600',
      'https://picsum.photos/seed/cnc-machine/800/600',
    ],
    imageAlts: [
      'Máy gia công kim loại tấm',
      'Sản phẩm kim loại tấm hoàn thiện',
    ],
    icon: '🏭',
    ctaLabel: 'Nhận báo giá',
    ctaLink: '/lien-he',
    ctaTarget: '_self',
    orderIndex: 0,
    tags: ['gia công', 'kim loại', 'CNC', 'thép tấm'],
    seoTitle: 'Dịch Vụ Gia Công Kim Loại Tấm Chuyên Nghiệp, Chính Xác Cao',
    seoDescription:
      'Nhận gia công kim loại tấm theo yêu cầu: cắt laser, chấn gấp, đột dập CNC. Cam kết chất lượng, tiến độ và giá cả cạnh tranh.',
    altText: 'Dịch vụ gia công kim loại tấm',
    status: ServiceStatus.published,
    themeVariant: ServiceThemeVariant.light,
    isFeatured: true,
  },
  {
    slug: 'dot-dap-kim-loai',
    title: 'Đột dập kim loại',
    subtitle: 'Định hình sản phẩm hàng loạt',
    shortDescription:
      'Dịch vụ đột dập kim loại tự động bằng hệ thống máy CNC, cho phép sản xuất hàng loạt các chi tiết phức tạp với tốc độ nhanh và chi phí tối ưu.',
    content: [
      'Đột dập là phương pháp gia công sử dụng lực lớn để định hình phôi kim loại theo khuôn mẫu có sẵn. Công nghệ này đặc biệt hiệu quả cho việc sản xuất số lượng lớn các sản phẩm có hình dạng giống nhau.',
      'Chúng tôi có khả năng thiết kế và chế tạo khuôn dập theo bản vẽ, đảm bảo sản phẩm cuối cùng đáp ứng đúng yêu cầu kỹ thuật của khách hàng.',
    ],
    features: [
      'Sản xuất hàng loạt với tốc độ cao.',
      'Độ chính xác và đồng nhất giữa các sản phẩm.',
      'Tối ưu chi phí cho đơn hàng lớn.',
      'Gia công được các chi tiết có biên dạng phức tạp.',
    ],
    technologies: ['Máy đột dập CNC Amada', 'Công nghệ thiết kế khuôn mẫu 3D'],
    benefits: [
      'Giảm giá thành sản phẩm.',
      'Rút ngắn thời gian sản xuất.',
      'Chất lượng sản phẩm ổn định.',
      'Linh hoạt trong việc thay đổi mẫu mã.',
    ],
    imageUrls: [
      'https://picsum.photos/seed/metal-stamping/800/600',
      'https://picsum.photos/seed/stamping-press/800/600',
    ],
    imageAlts: ['Máy đột dập kim loại CNC', 'Sản phẩm từ đột dập'],
    icon: '🔩',
    ctaLink: '/lien-he',
    orderIndex: 1,
    tags: ['đột dập', 'dập kim loại', 'CNC', 'sản xuất hàng loạt'],
    status: ServiceStatus.published,
  },
  {
    slug: 'chan-gap-kim-loai',
    title: 'Chấn gấp kim loại',
    subtitle: 'Tạo hình góc cạnh chính xác',
    shortDescription:
      'Dịch vụ chấn gấp kim loại bằng máy CNC hiện đại, tạo ra các góc gấp chính xác, đường nét sắc sảo cho các sản phẩm như vỏ tủ điện, khung máy, nội thất kim loại.',
    content: [
      'Chấn gấp là quá trình uốn cong các tấm kim loại phẳng thành các hình dạng mong muốn. Với máy chấn CNC, chúng tôi có thể kiểm soát chính xác góc độ và bán kính cong, tạo ra sản phẩm hoàn hảo.',
    ],
    features: [
      'Chấn được các tấm kim loại có độ dày lớn.',
      'Góc gấp chính xác, đồng đều.',
      'Đường nét sắc sảo, thẩm mỹ cao.',
      'Khả năng gia công các biên dạng phức tạp.',
    ],
    technologies: ['Máy chấn CNC Amada', 'Hệ thống dao chấn đa dạng'],
    benefits: [
      'Tăng độ cứng và độ bền cho sản phẩm.',
      'Tạo hình sản phẩm theo thiết kế.',
      'Đáp ứng các tiêu chuẩn kỹ thuật khắt khe.',
    ],
    imageUrls: [
      'https://picsum.photos/seed/metal-bending/800/600',
      'https://picsum.photos/seed/press-brake/800/600',
    ],
    imageAlts: ['Máy chấn gấp kim loại', 'Sản phẩm được chấn gấp'],
    icon: '📐',
    ctaLink: '/lien-he',
    orderIndex: 2,
    tags: ['chấn gấp', 'uốn kim loại', 'CNC', 'vỏ tủ điện'],
    status: ServiceStatus.published,
  },
  {
    slug: 'soi-ranh-kim-loai',
    title: 'Soi rãnh kim loại',
    subtitle: 'Tạo đường rãnh V-Groove sắc nét',
    shortDescription:
      'Dịch vụ soi rãnh V (V-Groove) trên bề mặt inox, nhôm, đồng... giúp tạo ra các góc gấp vuông vắn, sắc cạnh, nâng cao tính thẩm mỹ cho sản phẩm nội thất, quảng cáo.',
    content: [
      'Soi rãnh là bước quan trọng trước khi chấn gấp, đặc biệt với các vật liệu dày hoặc yêu cầu góc gấp nhỏ. Đường rãnh V giúp kim loại được uốn cong dễ dàng mà không bị rạn nứt hay biến dạng bề mặt.',
    ],
    features: [
      'Tạo góc gấp 90 độ sắc nét.',
      'Bán kính góc uốn siêu nhỏ.',
      'Tăng tính thẩm mỹ cho sản phẩm.',
      'Áp dụng trên nhiều vật liệu: inox, nhôm, đồng.',
    ],
    technologies: ['Máy soi rãnh CNC', 'Công nghệ bào rãnh V-Grooving'],
    benefits: [
      'Nâng tầm đẳng cấp cho sản phẩm.',
      'Dễ dàng thi công, lắp đặt.',
      'Loại bỏ hiện tượng rạn nứt bề mặt khi uốn.',
    ],
    imageUrls: [
      'https://picsum.photos/seed/v-grooving/800/600',
      'https://picsum.photos/seed/metal-grooving/800/600',
    ],
    imageAlts: ['Máy soi rãnh kim loại CNC', 'Bề mặt kim loại được soi rãnh'],
    icon: '✨',
    ctaLink: '/lien-he',
    orderIndex: 3,
    tags: ['soi rãnh', 'V-Groove', 'inox', 'trang trí nội thất'],
    status: ServiceStatus.published,
  },
  {
    slug: 'cat-laser-kim-loai',
    title: 'Cắt laser kim loại tấm, hộp định hình',
    subtitle: 'Đường cắt chính xác, tinh xảo',
    shortDescription:
      'Dịch vụ cắt laser CNC cho phép cắt các chi tiết kim loại từ đơn giản đến phức tạp với độ chính xác cực cao, đường cắt mịn, không ba via, áp dụng cho cả tấm và hộp.',
    content: [
      'Công nghệ cắt laser sử dụng chùm tia laser hội tụ năng lượng cao để làm nóng chảy và cắt vật liệu. Đây là phương pháp gia công hiện đại nhất, cho phép tạo ra các sản phẩm có hoa văn, chi tiết phức tạp.',
    ],
    features: [
      'Cắt được các chi tiết cực nhỏ, hoa văn phức tạp.',
      'Độ chính xác lên đến 0.05mm.',
      'Bề mặt cắt nhẵn, không cần gia công lại.',
      'Tốc độ cắt nhanh, hiệu quả.',
    ],
    technologies: ['Máy cắt Laser Fiber CNC', 'Phần mềm tối ưu hóa đường cắt'],
    benefits: [
      'Hiện thực hóa mọi ý tưởng thiết kế.',
      'Tiết kiệm vật liệu tối đa.',
      'Chất lượng sản phẩm vượt trội.',
      'Thời gian gia công nhanh chóng.',
    ],
    imageUrls: [
      'https://picsum.photos/seed/laser-cutting/800/600',
      'https://picsum.photos/seed/laser-cut-metal/800/600',
    ],
    imageAlts: ['Máy cắt laser kim loại', 'Sản phẩm cắt laser'],
    icon: '🔥',
    ctaLink: '/lien-he',
    orderIndex: 4,
    tags: ['cắt laser', 'laser CNC', 'hoa văn kim loại', 'cắt tấm'],
    status: ServiceStatus.published,
    isFeatured: true,
  },
  {
    slug: 'thi-cong-tran-thach-cao-tran-nhua',
    title: 'Thiết kế & thi công trần thạch cao, trần nhựa',
    subtitle: 'Không gian sống hiện đại, sang trọng',
    shortDescription:
      'Chuyên tư vấn, thiết kế và thi công các loại trần thạch cao, trần nhựa giả gỗ, lam sóng... cho nhà ở, văn phòng, cửa hàng với mẫu mã đa dạng, chi phí hợp lý.',
    content: [
      'Trần thạch cao và trần nhựa là giải pháp trang trí nội thất phổ biến, giúp che đi các khuyết điểm của trần bê tông, hệ thống dây điện, đồng thời tạo điểm nhấn thẩm mỹ cho không gian.',
      'Chúng tôi cung cấp giải pháp trọn gói từ khâu khảo sát, tư vấn, thiết kế 3D đến thi công hoàn thiện, đảm bảo sự hài lòng của khách hàng.',
    ],
    features: [
      'Mẫu mã đa dạng: trần phẳng, trần giật cấp, trần cổ điển...',
      'Vật liệu chính hãng, an toàn cho sức khỏe.',
      'Đội ngũ thi công chuyên nghiệp, giàu kinh nghiệm.',
      'Chế độ bảo hành dài hạn, uy tín.',
    ],
    technologies: ['Khung xương Vĩnh Tường', 'Tấm thạch cao Gyproc', 'Tấm nhựa AnPro'],
    benefits: [
      'Tăng tính thẩm mỹ cho không gian sống.',
      'Cách âm, cách nhiệt, chống cháy hiệu quả.',
      'Thi công nhanh chóng, sạch sẽ.',
      'Chi phí hợp lý, phù hợp nhiều ngân sách.',
    ],
    imageUrls: [
      'https://picsum.photos/seed/drywall-ceiling/800/600',
      'https://picsum.photos/seed/pvc-ceiling/800/600',
    ],
    imageAlts: ['Mẫu trần thạch cao đẹp', 'Thi công trần nhựa giả gỗ'],
    icon: '🏠',
    ctaLink: '/lien-he',
    orderIndex: 5,
    tags: ['trần thạch cao', 'trần nhựa', 'lam sóng', 'trang trí nội thất'],
    status: ServiceStatus.published,
  },
];

