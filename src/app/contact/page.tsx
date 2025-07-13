import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto | KidsHiz',
  description: 'Entre em contacto com a KidsHiz. Estamos aqui para ajudar com qualquer questão sobre atividades para crianças.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tem alguma questão? Estamos aqui para ajudar! Entre em contacto connosco.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Envie-nos uma Mensagem
              </CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e responderemos o mais rapidamente possível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" placeholder="Seu nome" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apelido</Label>
                    <Input id="lastName" placeholder="Seu apelido" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu.email@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input id="phone" type="tel" placeholder="+351 912 345 678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" placeholder="Como podemos ajudar?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Descreva a sua questão ou comentário em detalhe..."
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contacto</CardTitle>
                <CardDescription>
                  Pode contactar-nos através dos seguintes meios:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-gray-600">ola@kidshiz.pt</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Telefone</h4>
                    <p className="text-gray-600">+351 220 123 456</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Localização</h4>
                    <p className="text-gray-600">Porto, Portugal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Horário de Atendimento</h4>
                    <p className="text-gray-600">Segunda a Sexta: 9h00 - 18h00</p>
                    <p className="text-gray-600">Sábado: 9h00 - 13h00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Encontre respostas rápidas para as perguntas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Como faço uma reserva?</h4>
                    <p className="text-sm text-gray-600">Pode fazer uma reserva diretamente no site, escolhendo a atividade e sessão desejada.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Posso cancelar uma reserva?</h4>
                    <p className="text-sm text-gray-600">Sim, pode cancelar até 24 horas antes da atividade com reembolso total.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Como posso tornar-me um prestador?</h4>
                    <p className="text-sm text-gray-600">Contacte-nos para saber mais sobre como juntar-se à nossa rede de prestadores.</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <a href="/help">Ver Mais Perguntas</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sugestões e Feedback</CardTitle>
                <CardDescription>
                  A sua opinião é importante para nós!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Temos sempre interesse em melhorar os nossos serviços. 
                  Se tem sugestões ou feedback, por favor partilhe connosco.
                </p>
                <Button variant="outline" className="w-full">
                  Dar Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}