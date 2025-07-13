import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  FileText, 
  Search,
  BookOpen,
  Users,
  Settings,
  CreditCard,
  Calendar,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Suporte para Prestadores | KidsHiz',
  description: 'Suporte especializado para prestadores de atividades. Ajuda rápida e eficaz para todas as suas questões.',
};

export default function ProviderSupportPage() {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Chat ao Vivo',
      description: 'Resposta imediata para questões urgentes',
      availability: 'Disponível: 9h00-22h00',
      responseTime: 'Resposta em 2-5 minutos',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      buttonText: 'Iniciar Chat'
    },
    {
      icon: Phone,
      title: 'Suporte Telefónico',
      description: 'Converse diretamente com um especialista',
      availability: 'Segunda-Sexta: 9h00-18h00',
      responseTime: '+351 220 123 456',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      buttonText: 'Ligar Agora'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Para questões detalhadas e não urgentes',
      availability: 'Sempre disponível',
      responseTime: 'Resposta em 4-6 horas',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      buttonText: 'Enviar Email'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Headphones className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Suporte para Prestadores</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar. Suporte especializado para prestadores com respostas rápidas 
            e soluções eficazes.
          </p>
        </div>

        {/* Support Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Como Podemos Ajudar</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className={`${option.bgColor} border-0 hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6 text-center">
                    <Icon className={`h-12 w-12 ${option.textColor} mx-auto mb-4`} />
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                      <p>{option.availability}</p>
                      <p className="font-medium">{option.responseTime}</p>
                    </div>
                    <Button className={`w-full bg-${option.color}-600 hover:bg-${option.color}-700`}>
                      {option.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Perguntas Frequentes</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <CardTitle>Gestão de Conta</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Como atualizar as minhas informações de perfil?</h4>
                  <p className="text-gray-600 text-sm">Aceda ao seu dashboard e clique em "Editar Perfil". Pode atualizar todas as suas informações, incluindo descrição, fotos e contactos.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Como verificar o meu perfil?</h4>
                  <p className="text-gray-600 text-sm">Envie os documentos necessários através do seu dashboard. A verificação demora 2-3 dias úteis.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                  <CardTitle>Pagamentos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Quando recebo os pagamentos?</h4>
                  <p className="text-gray-600 text-sm">Os pagamentos são transferidos para a sua conta bancária todas as sextas-feiras.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Qual é a taxa da KidsHiz?</h4>
                  <p className="text-gray-600 text-sm">A nossa taxa é de 8% sobre o valor da reserva.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Ainda tem dúvidas?</CardTitle>
              <CardDescription className="text-center">
                Envie-nos a sua questão e respondemos rapidamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="O seu nome" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Descreva brevemente a sua questão" />
              </div>
              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" placeholder="Descreva a sua questão em detalhe..." rows={4} />
              </div>
              <Button className="w-full">Enviar Mensagem</Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Guias</h3>
              <p className="text-gray-600 mb-4">Tutoriais passo-a-passo para usar a plataforma</p>
              <Button variant="outline" className="w-full">
                Ver Guias
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Comunidade</h3>
              <p className="text-gray-600 mb-4">Conecte-se com outros prestadores</p>
              <Button variant="outline" className="w-full">
                Participar
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Configurações</h3>
              <p className="text-gray-600 mb-4">Personalize as suas preferências e notificações</p>
              <Link href="/provider/dashboard">
                <Button variant="outline" className="w-full">
                  Configurações
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}