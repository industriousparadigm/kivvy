import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with real Porto/Matosinhos data...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.savedActivity.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.activitySession.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.child.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create parent users - real Portuguese names and locations
  const parent1 = await prisma.user.create({
    data: {
      email: 'ana.santos@gmail.com',
      name: 'Ana Santos',
      password: hashedPassword,
      role: 'PARENT',
      profile: {
        create: {
          firstName: 'Ana',
          lastName: 'Santos',
          phone: '+351 912 345 678',
          address: 'Rua da Alegria, 123',
          city: 'Porto',
          postalCode: '4000-001',
          country: 'Portugal',
          dateOfBirth: new Date('1985-03-15'),
          language: 'pt',
        },
      },
    },
  });

  const parent2 = await prisma.user.create({
    data: {
      email: 'joana.silva@outlook.pt',
      name: 'Joana Silva',
      password: hashedPassword,
      role: 'PARENT',
      profile: {
        create: {
          firstName: 'Joana',
          lastName: 'Silva',
          phone: '+351 923 456 789',
          address: 'Avenida da Boavista, 456',
          city: 'Matosinhos',
          postalCode: '4450-100',
          country: 'Portugal',
          dateOfBirth: new Date('1988-07-20'),
          language: 'pt',
        },
      },
    },
  });

  // Create real Porto/Matosinhos providers
  const provider1 = await prisma.user.create({
    data: {
      email: 'geral@colibee.pt',
      name: 'Colibee Fun Park',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Carla',
          lastName: 'Ferreira',
          phone: '+351 912 345 678',
          address: 'R DO ENGENHEIRO FERREIRA DIAS 1010',
          city: 'Porto',
          postalCode: '4100-246',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Colibee Fun Park',
          businessType: 'CULTURAL_CENTER',
          description:
            'Parque infantil indoor no Porto com atividades para crianças dos 1-12 anos. Espaço ideal para festas de aniversário com diversões, jogos e momentos únicos para as crianças.',
          website: 'https://www.facebook.com/colibee.pt',
          phone: '+351 912 345 678',
          email: 'geral@colibee.pt',
          address: 'R DO ENGENHEIRO FERREIRA DIAS 1010',
          city: 'Porto',
          postalCode: '4100-246',
          country: 'Portugal',
          latitude: 41.1579,
          longitude: -8.6291,
          taxId: 'PT123456789',
          isVerified: true,
        },
      },
    },
  });

  const provider2 = await prisma.user.create({
    data: {
      email: 'porto@princelandia.pt',
      name: 'Princelandia Porto',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Sofia',
          lastName: 'Princesa',
          phone: '+351 913 892 720',
          address: 'Rua Tomaz Ribeiro',
          city: 'Matosinhos',
          postalCode: '4450-001',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Princelandia Porto',
          businessType: 'CULTURAL_CENTER',
          description:
            'O primeiro SPA infantil da Europa! Espaço de fantasia e magia concebido ao pormenor para meninas dos 4 aos 12 anos. Festas de Aniversário, Chá das Princesas, Spa e muito mais.',
          website: 'https://princelandia.pt',
          phone: '+351 913 892 720',
          email: 'porto@princelandia.pt',
          address: 'Rua Tomaz Ribeiro',
          city: 'Matosinhos',
          postalCode: '4450-001',
          country: 'Portugal',
          latitude: 41.182134,
          longitude: -8.685327,
          taxId: 'PT987654321',
          isVerified: true,
        },
      },
    },
  });

  const provider3 = await prisma.user.create({
    data: {
      email: 'yupicolor@colorfunparks.pt',
      name: 'YupiColor Fun Park',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Miguel',
          lastName: 'Oliveira',
          phone: '+351 911 140 061',
          address: 'Rua de Fortunato Silvério 60',
          city: 'Maia',
          postalCode: '4470-392',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'YupiColor Fun Park',
          businessType: 'CULTURAL_CENTER',
          description:
            'Espaço maravilhoso em Maia, ideal para festas de aniversário. Instalações espaçosas com monitores atenciosos e amigáveis. Espaço moderno e colorido com futebol, trampolins, karts, escorregas e muito mais.',
          website: 'https://colorfunparks.pt/yupicolor.php',
          phone: '+351 911 140 061',
          email: 'yupicolor@colorfunparks.pt',
          address: 'Rua de Fortunato Silvério 60',
          city: 'Maia',
          postalCode: '4470-392',
          country: 'Portugal',
          latitude: 41.2279,
          longitude: -8.6208,
          taxId: 'PT456789123',
          isVerified: true,
        },
      },
    },
  });

  const provider4 = await prisma.user.create({
    data: {
      email: 'geral@ateliedefestas.pt',
      name: 'Ateliê de Festas',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Carla',
          lastName: 'Freitas',
          phone: '+351 916 523 690',
          address: 'Rua Eng. Fernando Pinto de Oliveira 56',
          city: 'Matosinhos',
          postalCode: '4450-614',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Ateliê de Festas',
          businessType: 'CULTURAL_CENTER',
          description:
            'Parque infantil coberto com entretenimento e atividades lúdicas, pensado para brincadeira livre, festas de aniversário e organização de eventos para crianças dos 3 aos 12 anos.',
          website: 'https://www.pai.pt/paginas/310393-atelie-de-festas',
          phone: '+351 916 523 690',
          email: 'geral@ateliedefestas.pt',
          address: 'Rua Eng. Fernando Pinto de Oliveira 56',
          city: 'Matosinhos',
          postalCode: '4450-614',
          country: 'Portugal',
          latitude: 41.1962,
          longitude: -8.6892,
          taxId: 'PT789123456',
          isVerified: true,
        },
      },
    },
  });

  const provider5 = await prisma.user.create({
    data: {
      email: 'anotherworld.porto@gmail.com',
      name: 'Another World Porto',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Ricardo',
          lastName: 'Costa',
          phone: '+351 965 914 900',
          address: 'R. Dr Joaquim Pires de Lima 119',
          city: 'Porto',
          postalCode: '4200-347',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Another World Porto',
          businessType: 'CULTURAL_CENTER',
          description:
            'Arena de realidade virtual para festas de aniversário! Aventuras partilhadas em grupo para idades entre 6 e 18 anos. Experiências inesquecíveis com tecnologia de ponta.',
          website: 'https://porto.another-world.pt',
          phone: '+351 965 914 900',
          email: 'anotherworld.porto@gmail.com',
          address: 'R. Dr Joaquim Pires de Lima 119',
          city: 'Porto',
          postalCode: '4200-347',
          country: 'Portugal',
          latitude: 41.1496,
          longitude: -8.6109,
          taxId: 'PT234567890',
          isVerified: true,
        },
      },
    },
  });

  // Create children
  const child1 = await prisma.child.create({
    data: {
      parentId: parent1.id,
      firstName: 'Sofia',
      lastName: 'Santos',
      dateOfBirth: new Date('2015-05-10'),
      allergies: 'Nozes',
      medicalNotes: 'Asma ligeira',
      emergencyContact: 'Avó: +351 912 111 222',
    },
  });

  await prisma.child.create({
    data: {
      parentId: parent1.id,
      firstName: 'Miguel',
      lastName: 'Santos',
      dateOfBirth: new Date('2017-09-22'),
      emergencyContact: 'Avó: +351 912 111 222',
    },
  });

  await prisma.child.create({
    data: {
      parentId: parent2.id,
      firstName: 'Beatriz',
      lastName: 'Silva',
      dateOfBirth: new Date('2014-12-03'),
      allergies: 'Lactose',
      emergencyContact: 'Tia: +351 923 333 444',
    },
  });

  // Get provider records
  const provider1Record = await prisma.provider.findUnique({
    where: { userId: provider1.id },
  });
  const provider2Record = await prisma.provider.findUnique({
    where: { userId: provider2.id },
  });
  const provider3Record = await prisma.provider.findUnique({
    where: { userId: provider3.id },
  });
  const provider4Record = await prisma.provider.findUnique({
    where: { userId: provider4.id },
  });
  const provider5Record = await prisma.provider.findUnique({
    where: { userId: provider5.id },
  });

  if (
    !provider1Record ||
    !provider2Record ||
    !provider3Record ||
    !provider4Record ||
    !provider5Record
  ) {
    throw new Error('Provider records not found');
  }

  // Create real birthday party activities
  const activity1 = await prisma.activity.create({
    data: {
      providerId: provider1Record.id,
      title: 'Festa de Aniversário no Colibee Fun Park',
      description:
        'Festa de aniversário inesquecível no nosso parque infantil indoor! As crianças vão adorar brincar em todas as nossas atrações: escorregas, túneis, piscina de bolas, trampolins e muito mais. Inclui monitor, decoração, lanche e bolo. Um dia especial cheio de diversão e alegria para o seu pequeno tesouro.',
      shortDescription:
        'Festa de aniversário completa para crianças dos 1 aos 12 anos',
      category: 'OTHER',
      ageMin: 1,
      ageMax: 12,
      duration: 180, // 3 hours
      capacity: 25,
      price: 15.5, // per child
      location: 'R DO ENGENHEIRO FERREIRA DIAS 1010, Porto',
      imageUrl: '/images/hero-birthday-party.png',
      requirements: 'Roupa confortável e meias antiderrapantes obrigatórias',
      isActive: true,
      tags: [
        'festa',
        'aniversário',
        'indoor',
        'trampolins',
        'piscina de bolas',
      ],
    },
  });

  const activity2 = await prisma.activity.create({
    data: {
      providerId: provider2Record.id,
      title: 'Festa de Princesas no Princelandia',
      description:
        'Uma festa de aniversário mágica no primeiro SPA infantil da Europa! As meninas vão viver um conto de fadas com tratamentos de spa, manicure, penteados e muito glamour. Inclui chá das princesas, maquilhagem e sessão fotográfica. Um sonho tornado realidade para a sua princesa.',
      shortDescription:
        'Festa de princesas com spa e chá para meninas dos 4 aos 12 anos',
      category: 'OTHER',
      ageMin: 4,
      ageMax: 12,
      duration: 120, // 2 hours
      capacity: 12,
      price: 22.0, // per child
      location: 'Rua Tomaz Ribeiro, Matosinhos',
      imageUrl: '/images/caring-instructor.png',
      requirements:
        'Apenas para meninas. Recomendamos trazer roupa confortável para depois do spa.',
      included:
        'Tratamentos de spa infantil, manicure, penteados, maquilhagem, chá das princesas com doces, sessão fotográfica e muita diversão num ambiente de fantasia.',
      isActive: true,
      tags: ['festa', 'aniversário', 'princesas', 'spa', 'meninas'],
    },
  });

  const activity3 = await prisma.activity.create({
    data: {
      providerId: provider3Record.id,
      title: 'Festa Aventura no YupiColor',
      description:
        'Festa de aniversário cheia de aventura no nosso parque colorido! Futebol, trampolins, karts, escorregas, escalada e muito mais numa instalação moderna e segura. Monitores experientes garantem diversão e segurança. Inclui lanche, bolo e lembrança para todos.',
      shortDescription:
        'Festa aventura com atividades variadas dos 3 aos 12 anos',
      category: 'SPORTS',
      ageMin: 3,
      ageMax: 12,
      duration: 150, // 2.5 hours
      capacity: 20,
      price: 18.0, // per child
      location: 'Rua de Fortunato Silvério 60, Maia',
      imageUrl: '/images/activity-outdoor.png',
      requirements: 'Roupa desportiva confortável e ténis obrigatórios',
      included:
        'Atividades variadas: futebol, trampolins, karts, escorregas, túneis, escalada. Monitores dedicados, lanche nutritivo, bolo de aniversário e lembranças.',
      isActive: true,
      tags: ['festa', 'aniversário', 'aventura', 'desporto', 'trampolins'],
    },
  });

  const activity4 = await prisma.activity.create({
    data: {
      providerId: provider4Record.id,
      title: 'Festa Criativa no Ateliê de Festas',
      description:
        'Festa de aniversário num ambiente acolhedor e criativo! Parque infantil coberto com atividades lúdicas e educativas. Oficinas criativas, jogos tradicionais e muita diversão numa atmosfera familiar. Perfeito para uma celebração especial e inesquecível.',
      shortDescription: 'Festa criativa e educativa dos 3 aos 12 anos',
      category: 'ARTS_CRAFTS',
      ageMin: 3,
      ageMax: 12,
      duration: 120, // 2 hours
      capacity: 15,
      price: 16.5, // per child
      location: 'Rua Eng. Fernando Pinto de Oliveira 56, Matosinhos',
      imageUrl: '/images/testimonial-art-activity.png',
      requirements: 'Roupa que possa sujar durante as atividades criativas',
      included:
        'Oficinas criativas, jogos educativos, atividades lúdicas, parque coberto, lanche saudável e ambiente familiar acolhedor.',
      isActive: true,
      tags: ['festa', 'aniversário', 'criativo', 'educativo', 'oficinas'],
    },
  });

  const activity5 = await prisma.activity.create({
    data: {
      providerId: provider5Record.id,
      title: 'Festa Realidade Virtual - Another World',
      description:
        'Festa de aniversário futurista com realidade virtual! Aventuras partilhadas em mundos virtuais incríveis. Experiência única e inovadora para adolescentes que procuram algo diferente. Inclui acesso VIP, consolas, jogos de tabuleiro e espaço para lanche.',
      shortDescription: 'Festa de realidade virtual para dos 6 aos 18 anos',
      category: 'TECHNOLOGY',
      ageMin: 6,
      ageMax: 18,
      duration: 90, // 1.5 hours
      capacity: 14,
      price: 25.0, // per child
      location: 'R. Dr Joaquim Pires de Lima 119, Porto',
      imageUrl: '/images/activity-technology.png',
      requirements:
        'Idade mínima 6 anos. Crianças com óculos devem informar previamente.',
      included:
        'Aventuras em realidade virtual, acesso ao lounge VIP, consolas, jogos de tabuleiro, microondas e frigorífico disponíveis para lanche próprio.',
      isActive: true,
      tags: [
        'festa',
        'aniversário',
        'realidade virtual',
        'tecnologia',
        'inovador',
      ],
    },
  });

  // Create activity sessions
  const today = new Date();

  // Sessions for each activity over the next month
  for (let i = 0; i < 30; i++) {
    const sessionDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);

    // Skip Mondays (many venues are closed)
    if (sessionDate.getDay() === 1) continue;

    // Weekend sessions (Saturday and Sunday)
    if (sessionDate.getDay() === 0 || sessionDate.getDay() === 6) {
      // Morning sessions
      await prisma.activitySession.create({
        data: {
          activityId: activity1.id,
          startTime: new Date(sessionDate.setHours(10, 0, 0, 0)),
          endTime: new Date(sessionDate.setHours(13, 0, 0, 0)),
          capacity: 25,
          availableSpots: 25,
          price: 15.5,
        },
      });

      // Afternoon sessions
      await prisma.activitySession.create({
        data: {
          activityId: activity2.id,
          startTime: new Date(sessionDate.setHours(15, 0, 0, 0)),
          endTime: new Date(sessionDate.setHours(17, 0, 0, 0)),
          capacity: 12,
          availableSpots: 12,
          price: 22.0,
        },
      });

      await prisma.activitySession.create({
        data: {
          activityId: activity3.id,
          startTime: new Date(sessionDate.setHours(16, 30, 0, 0)),
          endTime: new Date(sessionDate.setHours(19, 0, 0, 0)),
          capacity: 20,
          availableSpots: 20,
          price: 18.0,
        },
      });
    }

    // Weekday afternoon sessions
    if (sessionDate.getDay() >= 2 && sessionDate.getDay() <= 5) {
      await prisma.activitySession.create({
        data: {
          activityId: activity4.id,
          startTime: new Date(sessionDate.setHours(16, 0, 0, 0)),
          endTime: new Date(sessionDate.setHours(18, 0, 0, 0)),
          capacity: 15,
          availableSpots: 15,
          price: 16.5,
        },
      });

      await prisma.activitySession.create({
        data: {
          activityId: activity5.id,
          startTime: new Date(sessionDate.setHours(17, 0, 0, 0)),
          endTime: new Date(sessionDate.setHours(18, 30, 0, 0)),
          capacity: 14,
          availableSpots: 14,
          price: 25.0,
        },
      });
    }
  }

  // Create some bookings
  const sessions = await prisma.activitySession.findMany({
    take: 3,
    where: {
      startTime: {
        gt: today,
      },
    },
  });

  if (sessions.length > 0) {
    await prisma.booking.create({
      data: {
        userId: parent1.id,
        childId: child1.id,
        sessionId: sessions[0].id,
        quantity: 8,
        totalAmount: sessions[0]?.price ? sessions[0].price * 8 : 0,
        status: 'CONFIRMED',
        notes: 'Festa da Sofia - tema princesas',
      },
    });

    // Update session availability
    await prisma.activitySession.update({
      where: { id: sessions[0].id },
      data: { availableSpots: sessions[0].availableSpots - 8 },
    });
  }

  // Create reviews with authentic Portuguese content
  await prisma.review.create({
    data: {
      userId: parent1.id,
      activityId: activity1.id,
      rating: 5,
      comment:
        'A festa da Sofia foi perfeita! As crianças adoraram todas as atividades e os monitores foram fantásticos. Muito bem organizado e as crianças saíram exaustas de tanto brincar. Recomendo vivamente!',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      userId: parent2.id,
      activityId: activity2.id,
      rating: 5,
      comment:
        'Experiência mágica no Princelandia! A Beatriz sentiu-se uma verdadeira princesa. O spa foi uma experiência única e ela ainda fala das amigas que fez lá. Voltaremos certamente!',
      isVerified: true,
    },
  });

  await prisma.review.create({
    data: {
      userId: parent1.id,
      activityId: activity3.id,
      rating: 4,
      comment:
        'Excelente festa no YupiColor! O Miguel adorou os trampolins e karts. Instalações muito limpas e seguras. Os monitores foram muito atenciosos. Única observação: podiam ter mais variedade no lanche.',
      isVerified: true,
    },
  });

  console.log(
    '✅ Database seeded successfully with real Porto/Matosinhos data!'
  );
  console.log(`
📊 Created:
- 2 parents
- 3 children  
- 5 real providers (Colibee, Princelandia, YupiColor, Ateliê de Festas, Another World)
- 5 birthday party activities
- ${await prisma.activitySession.count()} activity sessions
- ${await prisma.booking.count()} bookings
- 3 authentic reviews
  `);
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
