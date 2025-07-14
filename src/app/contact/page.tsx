import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Mail, Phone, MapPin, Clock, MessageCircle, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto | Kivvy',
  description:
    'Entre em contacto com a Kivvy. Estamos aqui para ajudar com qualquer questão sobre atividades para crianças.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <Header />
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <h1 className="text-4xl font-light text-rose-900 mb-4">
              Fale Connosco
            </h1>
            <p className="text-xl text-rose-700 max-w-2xl mx-auto leading-relaxed">
              Estamos aqui para tornar cada momento especial. Como podemos
              ajudar a criar memórias inesquecíveis?
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rose-900">
                  <MessageCircle className="h-5 w-5 text-rose-600" />
                  Partilhe o Seu Sonho
                </CardTitle>
                <CardDescription className="text-rose-700">
                  Conte-nos como podemos criar momentos mágicos para os seus
                  pequenos.
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
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+351 912 345 678"
                    />
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
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Enviar com Carinho
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-rose-900">
                    Como Nos Encontrar
                  </CardTitle>
                  <CardDescription className="text-rose-700">
                    Estamos sempre prontos para ouvir e ajudar:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-rose-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-rose-900">Email</h4>
                      <p className="text-rose-700">ola@kivvy.pt</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-rose-900">Telefone</h4>
                      <p className="text-rose-700">+351 220 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-rose-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-rose-900">
                        Localização
                      </h4>
                      <p className="text-rose-700">Porto, Portugal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-rose-900">
                        Horário de Atendimento
                      </h4>
                      <p className="text-rose-700">
                        Segunda a Sexta: 9h00 - 18h00
                      </p>
                      <p className="text-rose-700">Sábado: 9h00 - 13h00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-rose-900">
                    Perguntas Frequentes
                  </CardTitle>
                  <CardDescription className="text-rose-700">
                    Respostas carinhosas às suas dúvidas mais comuns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-rose-900">
                        Como faço uma reserva?
                      </h4>
                      <p className="text-sm text-rose-700">
                        É muito simples! Escolha a atividade perfeita e reserve
                        o momento especial em poucos cliques.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-rose-900">
                        Posso cancelar uma reserva?
                      </h4>
                      <p className="text-sm text-rose-700">
                        Claro! Entendemos que os planos podem mudar. Cancele até
                        24 horas antes com reembolso total.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-rose-900">
                        Como posso tornar-me um prestador?
                      </h4>
                      <p className="text-sm text-rose-700">
                        Adoraríamos conhecê-lo! Contacte-nos para se juntar à
                        nossa família de criadores de memórias.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      <a href="/help">Ver Mais Perguntas</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-rose-900">
                    O Seu Coração Fala
                  </CardTitle>
                  <CardDescription className="text-rose-700">
                    A sua opinião ajuda-nos a criar momentos ainda mais
                    especiais!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-rose-700 mb-4">
                    Cada sugestão é um presente que nos ajuda a crescer e a
                    cuidar melhor das suas preciosas memórias.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    Partilhar do Coração
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
