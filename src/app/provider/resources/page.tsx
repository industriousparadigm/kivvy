import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Camera, 
  MessageSquare, 
  Star, 
  DollarSign,
  Calendar,
  BarChart,
  Shield,
  Download,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Target,
  Award
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recursos para Prestadores | KidsHiz',
  description: 'Recursos, guias e ferramentas para prestadores de atividades na KidsHiz. Maximize o sucesso do seu negócio.',
};

export default function ProviderResourcesPage() {
  const resources = [
    {
      category: 'Guias de Início',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      items: [
        {
          title: 'Guia Completo do Prestador',
          description: 'Tudo o que precisa de saber para começar na KidsHiz',
          type: 'PDF',
          link: '#'
        },
        {
          title: 'Configuração do Perfil',
          description: 'Como criar um perfil atrativo e completo',
          type: 'Vídeo',
          link: '#'
        },
        {
          title: 'Primeiros Passos',
          description: 'Checklist para começar a receber reservas',
          type: 'Checklist',
          link: '#'
        }
      ]
    },
    {
      category: 'Marketing & Vendas',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      items: [
        {
          title: 'Fotografias que Vendem',
          description: 'Dicas para tirar fotos atrativas das suas atividades',
          type: 'Guia',
          link: '#'
        },
        {
          title: 'Descrições Persuasivas',
          description: 'Como escrever descrições que convertem',
          type: 'Template',
          link: '#'
        },
        {
          title: 'Preços Competitivos',
          description: 'Estratégias de preços para maximizar reservas',
          type: 'Webinar',
          link: '#'
        }
      ]
    },
    {
      category: 'Gestão de Clientes',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      items: [
        {
          title: 'Comunicação Eficaz',
          description: 'Como comunicar profissionalmente com os pais',
          type: 'Guia',
          link: '#'
        },
        {
          title: 'Gestão de Expectativas',
          description: 'Defina expectativas claras desde o início',
          type: 'Template',
          link: '#'
        },
        {
          title: 'Resolução de Conflitos',
          description: 'Como lidar com situações difíceis',
          type: 'Vídeo',
          link: '#'
        }
      ]
    },
    {
      category: 'Ferramentas Técnicas',
      icon: BarChart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      items: [
        {
          title: 'Analytics do Prestador',
          description: 'Como interpretar as suas estatísticas',
          type: 'Tutorial',
          link: '#'
        },
        {
          title: 'Gestão de Calendário',
          description: 'Otimize a sua agenda para maximizar reservas',
          type: 'Guia',
          link: '#'
        },
        {
          title: 'App Móvel',
          description: 'Gira o seu negócio em movimento',
          type: 'Download',
          link: '#'
        }
      ]
    }
  ];

  const bestPractices = [
    {
      icon: Star,
      title: 'Mantenha uma Classificação Alta',
      description: 'Prestadores com 4.5+ estrelas recebem 40% mais reservas',
      tips: ['Responda rapidamente', 'Supere expectativas', 'Peça feedback']
    },
    {
      icon: Camera,
      title: 'Use Fotos de Qualidade',
      description: 'Atividades com fotos profissionais têm 3x mais visualizações',
      tips: ['Luz natural', 'Crianças felizes', 'Espaços limpos']
    },
    {
      icon: MessageSquare,
      title: 'Comunique Proactivamente',
      description: 'Prestadores que comunicam bem têm menos cancelamentos',
      tips: ['Confirme reservas', 'Envie lembretes', 'Partilhe detalhes']
    },
    {
      icon: Calendar,
      title: 'Mantenha Disponibilidade',
      description: 'Calendários atualizados geram mais confiança',
      tips: ['Atualize regularmente', 'Planeie com antecedência', 'Seja flexível']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recursos para Prestadores</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tudo o que precisa para ter sucesso na KidsHiz. Guias, ferramentas e dicas 
            dos nossos melhores prestadores.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Taxa de Satisfação</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">2.5x</div>
              <div className="text-sm text-gray-600">Mais Reservas</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
              <div className="text-sm text-gray-600">Suporte Rápido</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Recursos Disponíveis</div>
            </CardContent>
          </Card>
        </div>

        {/* Resources by Category */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recursos por Categoria</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Melhores Práticas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{practice.title}</h3>
                        <p className="text-gray-600 mb-4">{practice.description}</p>
                        <div className="space-y-2">
                          {practice.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-sm text-gray-700">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Histórias de Sucesso</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Academia de Natação</h3>
                    <p className="text-sm text-gray-600">Porto</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "A KidsHiz aumentou as nossas reservas em 200% no primeiro mês. A plataforma é intuitiva e o suporte é excecional."
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0 (127 avaliações)</span>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">FC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Future Coders</h3>
                    <p className="text-sm text-gray-600">Matosinhos</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Conseguimos alcançar muito mais famílias interessadas em programação para crianças. A qualidade dos pais é excecional."
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9 (89 avaliações)</span>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">DM</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Dança Movimento</h3>
                    <p className="text-sm text-gray-600">Porto</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "A gestão de reservas ficou muito mais fácil. Conseguimos focar-nos no que fazemos melhor: ensinar dança."
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.8 (156 avaliações)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Training & Events */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Formação e Eventos</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Webinars Mensais
                </CardTitle>
                <CardDescription>Sessões de formação ao vivo com especialistas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Marketing Digital para Prestadores</h4>
                      <p className="text-sm text-gray-600">15 de Agosto, 18h00</p>
                    </div>
                    <Badge>Inscrição Aberta</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Gestão de Clientes Difíceis</h4>
                      <p className="text-sm text-gray-600">22 de Agosto, 19h00</p>
                    </div>
                    <Badge variant="outline">Brevemente</Badge>
                  </div>
                  <Button className="w-full">
                    Ver Todos os Webinars
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Workshops Presenciais
                </CardTitle>
                <CardDescription>Formação intensiva no Porto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Bootcamp de Vendas</h4>
                      <p className="text-sm text-gray-600">5 de Setembro, 9h00-17h00</p>
                    </div>
                    <Badge>Lugares Limitados</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Networking de Prestadores</h4>
                      <p className="text-sm text-gray-600">20 de Setembro, 18h00</p>
                    </div>
                    <Badge variant="outline">Gratuito</Badge>
                  </div>
                  <Button className="w-full">
                    Inscrever-se
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Suporte Dedicado
            </CardTitle>
            <CardDescription>Estamos aqui para o ajudar a ter sucesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Chat de Suporte</h3>
                <p className="text-sm text-gray-600 mb-4">Resposta imediata para questões urgentes</p>
                <Button variant="outline" size="sm">
                  Abrir Chat
                </Button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Gestor de Conta</h3>
                <p className="text-sm text-gray-600 mb-4">Suporte personalizado para o seu crescimento</p>
                <Button variant="outline" size="sm">
                  Contactar
                </Button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Centro de Ajuda</h3>
                <p className="text-sm text-gray-600 mb-4">Documentação completa e tutoriais</p>
                <Button variant="outline" size="sm">
                  <a href="/help">Visitar</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}