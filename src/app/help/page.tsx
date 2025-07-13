import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  HelpCircle,
  User,
  CreditCard,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  BookOpen,
  Shield,
  Settings,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Centro de Ajuda | KidsHiz',
  description:
    'Encontre respostas para as suas perguntas sobre a KidsHiz. Suporte completo para pais e prestadores.',
};

export default function HelpPage() {
  const faqCategories = [
    {
      icon: User,
      title: 'Conta e Perfil',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      questions: [
        {
          q: 'Como criar uma conta na KidsHiz?',
          a: 'Pode criar uma conta clicando em "Registar" e escolhendo entre registo com email ou Google. Preencha os seus dados e confirme o email.',
        },
        {
          q: 'Como adicionar informações sobre os meus filhos?',
          a: 'No seu dashboard, clique em "Adicionar Criança" e preencha as informações como nome, idade e necessidades especiais.',
        },
        {
          q: 'Posso alterar as minhas informações pessoais?',
          a: 'Sim, aceda ao seu perfil em "Conta" e edite as informações que pretende alterar.',
        },
      ],
    },
    {
      icon: Calendar,
      title: 'Reservas',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      questions: [
        {
          q: 'Como fazer uma reserva?',
          a: 'Escolha a atividade desejada, selecione a sessão, escolha a criança e proceda ao pagamento. Receberá uma confirmação por email.',
        },
        {
          q: 'Posso reservar para múltiplas crianças?',
          a: 'Sim, pode adicionar várias crianças à mesma reserva se houver disponibilidade.',
        },
        {
          q: 'Como vejo as minhas reservas?',
          a: 'Aceda ao seu dashboard onde encontrará todas as suas reservas organizadas por data.',
        },
      ],
    },
    {
      icon: CreditCard,
      title: 'Pagamentos',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      questions: [
        {
          q: 'Que métodos de pagamento aceitam?',
          a: 'Aceitamos cartões de crédito/débito, MBWay e transferência bancária.',
        },
        {
          q: 'O pagamento é seguro?',
          a: 'Sim, utilizamos encriptação SSL e parceiros seguros como Stripe para processar pagamentos.',
        },
        {
          q: 'Posso obter reembolso se cancelar?',
          a: 'Sim, seguimos uma política de reembolso baseada no tempo de cancelamento. Consulte os nossos termos para detalhes.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Segurança',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      questions: [
        {
          q: 'Como garantem a segurança das atividades?',
          a: 'Trabalhamos apenas com prestadores verificados e encorajamos os pais a ler avaliações antes de reservar.',
        },
        {
          q: 'Os prestadores são verificados?',
          a: 'Sim, todos os prestadores passam por um processo de verificação que inclui documentação e referências.',
        },
        {
          q: 'Como reportar um problema?',
          a: 'Pode reportar problemas através do nosso sistema de suporte ou contactando-nos diretamente.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-rose-600" />
          </div>
          <h1 className="text-4xl font-light text-rose-900 mb-4">
            Centro de Ajuda
          </h1>
          <p className="text-xl text-rose-700 max-w-2xl mx-auto">
            Estamos aqui para tornar tudo mais fácil para si e para o seu
            pequeno.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquise por palavra-chave..."
                  className="pl-10 pr-4 py-2 h-12 text-lg"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">reservas</Badge>
                <Badge variant="outline">pagamentos</Badge>
                <Badge variant="outline">cancelamentos</Badge>
                <Badge variant="outline">conta</Badge>
                <Badge variant="outline">segurança</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <div
                          key={faqIndex}
                          className="border-l-4 border-gray-200 pl-4 hover:border-blue-400 transition-colors"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {faq.q}
                          </h4>
                          <p className="text-gray-600 text-sm">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Links Úteis
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Guia do Utilizador</h3>
                      <p className="text-sm text-gray-600">
                        Como usar a plataforma
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Gestão de Conta</h3>
                      <p className="text-sm text-gray-600">
                        Configurações e preferências
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Segurança</h3>
                      <p className="text-sm text-gray-600">
                        Políticas e privacidade
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Ainda Precisa de Ajuda?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Chat ao Vivo</h3>
                <p className="text-gray-600 mb-4">
                  Fale connosco em tempo real
                </p>
                <p className="text-sm text-gray-500 mb-4">Disponível: 9h-18h</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Iniciar Chat
                </button>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <p className="text-gray-600 mb-4">Envie-nos um email</p>
                <p className="text-sm text-gray-500 mb-4">Resposta em 24h</p>
                <a
                  href="mailto:ajuda@kidshiz.pt"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
                >
                  Enviar Email
                </a>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Phone className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Telefone</h3>
                <p className="text-gray-600 mb-4">Ligue-nos diretamente</p>
                <p className="text-sm text-gray-500 mb-4">+351 220 123 456</p>
                <a
                  href="tel:+351220123456"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
                >
                  Ligar Agora
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Recursos Adicionais</CardTitle>
            <CardDescription className="text-center">
              Explore mais recursos para tirar o máximo partido da KidsHiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Para Pais</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Como escolher a atividade certa
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Dicas de segurança
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Gestão de múltiplas crianças
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Políticas de cancelamento
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Para Prestadores</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="/provider/signup"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Como juntar-se à KidsHiz
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="/provider/resources"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Recursos para prestadores
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="#"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Melhores práticas
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4" />
                    <a
                      href="/provider/support"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Suporte para prestadores
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
