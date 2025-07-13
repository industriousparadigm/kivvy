import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.review.deleteMany()
  await prisma.savedActivity.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.activitySession.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.child.deleteMany()
  await prisma.userProfile.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create parent users
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
  })

  const parent2 = await prisma.user.create({
    data: {
      email: 'joao.silva@gmail.com',
      name: 'João Silva',
      password: hashedPassword,
      role: 'PARENT',
      profile: {
        create: {
          firstName: 'João',
          lastName: 'Silva',
          phone: '+351 923 456 789',
          address: 'Avenida dos Aliados, 456',
          city: 'Porto',
          postalCode: '4000-002',
          country: 'Portugal',
          dateOfBirth: new Date('1980-07-22'),
          language: 'pt',
        },
      },
    },
  })

  // Create provider users
  const provider1 = await prisma.user.create({
    data: {
      email: 'contact@escolanatacao.pt',
      name: 'Escola de Natação Porto',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Maria',
          lastName: 'Costa',
          phone: '+351 934 567 890',
          address: 'Rua da Piscina, 789',
          city: 'Porto',
          postalCode: '4100-001',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Escola de Natação Porto',
          businessType: 'ACADEMY',
          description: 'Escola de natação com mais de 20 anos de experiência no ensino de natação para crianças e adultos.',
          website: 'https://escolanatacao.pt',
          phone: '+351 934 567 890',
          email: 'contact@escolanatacao.pt',
          address: 'Rua da Piscina, 789',
          city: 'Porto',
          postalCode: '4100-001',
          country: 'Portugal',
          latitude: 41.1579,
          longitude: -8.6291,
          taxId: 'PT123456789',
          isVerified: true,
          isActive: true,
        },
      },
    },
  })

  const provider2 = await prisma.user.create({
    data: {
      email: 'info@academiadanca.pt',
      name: 'Academia de Dança Movimento',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Sofia',
          lastName: 'Ferreira',
          phone: '+351 945 678 901',
          address: 'Rua da Dança, 321',
          city: 'Matosinhos',
          postalCode: '4450-001',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Academia de Dança Movimento',
          businessType: 'ACADEMY',
          description: 'Academia especializada em dança para crianças e jovens, com aulas de ballet, jazz, hip-hop e dança contemporânea.',
          website: 'https://academiadanca.pt',
          phone: '+351 945 678 901',
          email: 'info@academiadanca.pt',
          address: 'Rua da Dança, 321',
          city: 'Matosinhos',
          postalCode: '4450-001',
          country: 'Portugal',
          latitude: 41.1833,
          longitude: -8.6854,
          taxId: 'PT987654321',
          isVerified: true,
          isActive: true,
        },
      },
    },
  })

  const provider3 = await prisma.user.create({
    data: {
      email: 'hello@futurecoders.pt',
      name: 'Future Coders',
      password: hashedPassword,
      role: 'PROVIDER',
      profile: {
        create: {
          firstName: 'Pedro',
          lastName: 'Oliveira',
          phone: '+351 956 789 012',
          address: 'Rua da Tecnologia, 654',
          city: 'Porto',
          postalCode: '4200-001',
          country: 'Portugal',
          language: 'pt',
        },
      },
      provider: {
        create: {
          businessName: 'Future Coders',
          businessType: 'ACADEMY',
          description: 'Cursos de programação e tecnologia para crianças e jovens. Scratch, Python, desenvolvimento web e robótica.',
          website: 'https://futurecoders.pt',
          phone: '+351 956 789 012',
          email: 'hello@futurecoders.pt',
          address: 'Rua da Tecnologia, 654',
          city: 'Porto',
          postalCode: '4200-001',
          country: 'Portugal',
          latitude: 41.1496,
          longitude: -8.6109,
          taxId: 'PT456789123',
          isVerified: true,
          isActive: true,
        },
      },
    },
  })

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
  })

  const child2 = await prisma.child.create({
    data: {
      parentId: parent1.id,
      firstName: 'Miguel',
      lastName: 'Santos',
      dateOfBirth: new Date('2017-09-22'),
      emergencyContact: 'Avó: +351 912 111 222',
    },
  })

  const child3 = await prisma.child.create({
    data: {
      parentId: parent2.id,
      firstName: 'Beatriz',
      lastName: 'Silva',
      dateOfBirth: new Date('2014-12-03'),
      allergies: 'Lactose',
      emergencyContact: 'Tia: +351 923 333 444',
    },
  })

  // Get provider records
  const provider1Record = await prisma.provider.findUnique({
    where: { userId: provider1.id },
  })
  const provider2Record = await prisma.provider.findUnique({
    where: { userId: provider2.id },
  })
  const provider3Record = await prisma.provider.findUnique({
    where: { userId: provider3.id },
  })

  if (!provider1Record || !provider2Record || !provider3Record) {
    throw new Error('Provider records not found')
  }

  // Create activities
  const activity1 = await prisma.activity.create({
    data: {
      providerId: provider1Record.id,
      title: 'Natação para Crianças - Iniciação',
      description: 'Aulas de natação para crianças iniciantes, focadas na adaptação ao meio aquático e aprendizagem das técnicas básicas de natação. Ambiente seguro e divertido com instrutores especializados.',
      shortDescription: 'Aulas de natação para iniciantes dos 4 aos 12 anos',
      category: 'SWIMMING',
      ageMin: 4,
      ageMax: 12,
      capacity: 8,
      price: 45.00,
      currency: 'EUR',
      duration: 45,
      language: 'pt',
      difficulty: 'BEGINNER',
      location: 'Piscina Interior Aquecida',
      address: 'Rua da Piscina, 789',
      city: 'Porto',
      postalCode: '4100-001',
      latitude: 41.1579,
      longitude: -8.6291,
      imageUrl: 'https://example.com/swimming-kids.jpg',
      imageUrls: [
        'https://example.com/swimming-kids.jpg',
        'https://example.com/swimming-pool.jpg',
        'https://example.com/swimming-instructor.jpg',
      ],
      requirements: 'Fato de banho, touca, chinelos antiderrapantes',
      included: 'Equipamento de apoio, seguro de acidentes pessoais',
      notIncluded: 'Toalha, produtos de higiene pessoal',
      tags: ['natação', 'iniciação', 'água', 'segurança', 'diversão'],
      isActive: true,
    },
  })

  const activity2 = await prisma.activity.create({
    data: {
      providerId: provider2Record.id,
      title: 'Ballet Clássico - Nível Inicial',
      description: 'Aulas de ballet clássico para crianças, desenvolvendo a postura, coordenação, flexibilidade e expressão artística. Método pedagógico adaptado à idade, com foco na diversão e aprendizagem.',
      shortDescription: 'Ballet para crianças dos 5 aos 10 anos',
      category: 'DANCE',
      ageMin: 5,
      ageMax: 10,
      capacity: 12,
      price: 35.00,
      currency: 'EUR',
      duration: 60,
      language: 'pt',
      difficulty: 'BEGINNER',
      location: 'Estúdio de Dança Principal',
      address: 'Rua da Dança, 321',
      city: 'Matosinhos',
      postalCode: '4450-001',
      latitude: 41.1833,
      longitude: -8.6854,
      imageUrl: 'https://example.com/ballet-kids.jpg',
      imageUrls: [
        'https://example.com/ballet-kids.jpg',
        'https://example.com/ballet-studio.jpg',
        'https://example.com/ballet-teacher.jpg',
      ],
      requirements: 'Collant, sapatilhas de ballet, cabelo apanhado',
      included: 'Uso do estúdio, barras de apoio, espelhos',
      notIncluded: 'Vestuário de dança, sapatilhas',
      tags: ['ballet', 'dança', 'postura', 'flexibilidade', 'arte'],
      isActive: true,
    },
  })

  const activity3 = await prisma.activity.create({
    data: {
      providerId: provider3Record.id,
      title: 'Programação com Scratch',
      description: 'Curso de introdução à programação para crianças usando a linguagem visual Scratch. Aprender conceitos básicos de programação criando jogos e animações divertidas.',
      shortDescription: 'Programação para crianças dos 7 aos 14 anos',
      category: 'TECHNOLOGY',
      ageMin: 7,
      ageMax: 14,
      capacity: 10,
      price: 40.00,
      currency: 'EUR',
      duration: 90,
      language: 'pt',
      difficulty: 'BEGINNER',
      location: 'Sala de Informática',
      address: 'Rua da Tecnologia, 654',
      city: 'Porto',
      postalCode: '4200-001',
      latitude: 41.1496,
      longitude: -8.6109,
      imageUrl: 'https://example.com/scratch-programming.jpg',
      imageUrls: [
        'https://example.com/scratch-programming.jpg',
        'https://example.com/computer-lab.jpg',
        'https://example.com/kids-coding.jpg',
      ],
      requirements: 'Conhecimentos básicos de computador',
      included: 'Computador, software, certificado de participação',
      notIncluded: 'Material de escrita',
      tags: ['programação', 'scratch', 'tecnologia', 'criatividade', 'lógica'],
      isActive: true,
    },
  })

  const activity4 = await prisma.activity.create({
    data: {
      providerId: provider2Record.id,
      title: 'Hip-Hop para Jovens',
      description: 'Aulas de hip-hop com coreografias modernas e urbanas. Desenvolvimento da coordenação motora, ritmo e expressão corporal através da dança contemporânea.',
      shortDescription: 'Hip-hop para jovens dos 10 aos 16 anos',
      category: 'DANCE',
      ageMin: 10,
      ageMax: 16,
      capacity: 15,
      price: 38.00,
      currency: 'EUR',
      duration: 75,
      language: 'pt',
      difficulty: 'INTERMEDIATE',
      location: 'Estúdio de Dança Urbana',
      address: 'Rua da Dança, 321',
      city: 'Matosinhos',
      postalCode: '4450-001',
      latitude: 41.1833,
      longitude: -8.6854,
      imageUrl: 'https://example.com/hiphop-dance.jpg',
      imageUrls: [
        'https://example.com/hiphop-dance.jpg',
        'https://example.com/urban-studio.jpg',
        'https://example.com/dance-group.jpg',
      ],
      requirements: 'Roupa confortável, ténis adequados para dança',
      included: 'Som profissional, espelhos, ar condicionado',
      notIncluded: 'Roupa de dança, ténis',
      tags: ['hip-hop', 'dança urbana', 'ritmo', 'coordenação', 'expressão'],
      isActive: true,
    },
  })

  // Create activity sessions
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)

  // Swimming sessions
  await prisma.activitySession.createMany({
    data: [
      {
        activityId: activity1.id,
        startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 16, 0),
        endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 16, 45),
        capacity: 8,
        availableSpots: 5,
        status: 'SCHEDULED',
      },
      {
        activityId: activity1.id,
        startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 2, 16, 0),
        endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 2, 16, 45),
        capacity: 8,
        availableSpots: 7,
        status: 'SCHEDULED',
      },
      {
        activityId: activity1.id,
        startTime: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 16, 0),
        endTime: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate(), 16, 45),
        capacity: 8,
        availableSpots: 8,
        status: 'SCHEDULED',
      },
    ],
  })

  // Ballet sessions
  await prisma.activitySession.createMany({
    data: [
      {
        activityId: activity2.id,
        startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 1, 17, 0),
        endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 1, 18, 0),
        capacity: 12,
        availableSpots: 9,
        status: 'SCHEDULED',
      },
      {
        activityId: activity2.id,
        startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 3, 17, 0),
        endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 3, 18, 0),
        capacity: 12,
        availableSpots: 10,
        status: 'SCHEDULED',
      },
    ],
  })

  // Programming sessions
  await prisma.activitySession.createMany({
    data: [
      {
        activityId: activity3.id,
        startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 5, 14, 0),
        endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 5, 15, 30),
        capacity: 10,
        availableSpots: 6,
        status: 'SCHEDULED',
      },
      {
        activityId: activity3.id,
        startTime: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate() + 5, 14, 0),
        endTime: new Date(twoWeeksLater.getFullYear(), twoWeeksLater.getMonth(), twoWeeksLater.getDate() + 5, 15, 30),
        capacity: 10,
        availableSpots: 10,
        status: 'SCHEDULED',
      },
    ],
  })

  // Hip-hop sessions
  await prisma.activitySession.createMany({
    data: [
      {
        activityId: activity4.id,
        startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 4, 18, 0),
        endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate() + 4, 19, 15),
        capacity: 15,
        availableSpots: 12,
        status: 'SCHEDULED',
      },
    ],
  })

  // Create some sample bookings
  const sessions = await prisma.activitySession.findMany()
  
  const booking1 = await prisma.booking.create({
    data: {
      userId: parent1.id,
      childId: child1.id,
      sessionId: sessions[0].id,
      quantity: 1,
      totalAmount: 45.00,
      currency: 'EUR',
      status: 'CONFIRMED',
      paymentStatus: 'SUCCEEDED',
      paymentId: 'pi_test_123',
      payment: {
        create: {
          stripePaymentIntentId: 'pi_test_123',
          paymentMethodType: 'STRIPE_CARD',
          amount: 45.00,
          currency: 'EUR',
          status: 'SUCCEEDED',
          providerFee: 4.50,
          netAmount: 40.50,
          metadata: {
            stripePaymentIntentId: 'pi_test_123',
            paymentMethod: 'card',
          },
        },
      },
    },
  })

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        userId: parent1.id,
        activityId: activity1.id,
        providerId: provider1Record.id,
        rating: 5,
        title: 'Excelente experiência!',
        comment: 'A minha filha adorou as aulas de natação. A professora é muito paciente e carinhosa. Recomendo!',
        isVerified: true,
      },
      {
        userId: parent2.id,
        activityId: activity2.id,
        providerId: provider2Record.id,
        rating: 4,
        title: 'Muito bom ballet',
        comment: 'A minha filha está a adorar as aulas de ballet. A evolução tem sido notável.',
        isVerified: true,
      },
      {
        userId: parent1.id,
        activityId: activity3.id,
        providerId: provider3Record.id,
        rating: 5,
        title: 'Perfeito para iniciação à programação',
        comment: 'O Miguel ficou fascinado com a programação. As aulas são muito bem estruturadas e divertidas.',
        isVerified: true,
      },
    ],
  })

  // Create saved activities
  await prisma.savedActivity.createMany({
    data: [
      {
        userId: parent1.id,
        activityId: activity2.id,
      },
      {
        userId: parent1.id,
        activityId: activity4.id,
      },
      {
        userId: parent2.id,
        activityId: activity3.id,
      },
    ],
  })

  // Update available spots based on bookings
  await prisma.activitySession.update({
    where: { id: sessions[0].id },
    data: { availableSpots: { decrement: 1 } },
  })

  console.log('✅ Database seeded successfully!')
  console.log('📊 Created:')
  console.log('- 3 Parent users')
  console.log('- 3 Provider users')
  console.log('- 3 Children')
  console.log('- 4 Activities')
  console.log('- 8 Activity sessions')
  console.log('- 1 Booking with payment')
  console.log('- 3 Reviews')
  console.log('- 3 Saved activities')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })