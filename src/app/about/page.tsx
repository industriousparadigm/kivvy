import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Shield, Heart, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nós | KidsHiz',
  description: 'Conheça a KidsHiz, a plataforma que conecta famílias às melhores atividades para crianças no Porto e Matosinhos.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sobre a KidsHiz
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conectamos famílias às melhores atividades para crianças no Porto e Matosinhos,
            criando experiências memoráveis e promovendo o desenvolvimento integral dos pequenos.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">A Nossa Missão</h2>
            <p className="text-gray-600 mb-4">
              A KidsHiz nasceu da necessidade de simplificar a vida dos pais na busca por atividades 
              de qualidade para os seus filhos. Acreditamos que cada criança merece oportunidades 
              para explorar, aprender e crescer num ambiente seguro e estimulante.
            </p>
            <p className="text-gray-600">
              Trabalhamos para criar uma ponte entre famílias e prestadores de atividades, 
              garantindo transparência, qualidade e facilidade em cada reserva.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Os Nossos Valores</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Segurança e confiança</span>
              </li>
              <li className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-red-600" />
                <span className="text-gray-700">Cuidado personalizado</span>
              </li>
              <li className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-gray-700">Excelência no serviço</span>
              </li>
              <li className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-gray-700">Comunidade forte</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">500+</CardTitle>
              <CardDescription>Atividades Disponíveis</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-600">50+</CardTitle>
              <CardDescription>Prestadores Parceiros</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-600">1000+</CardTitle>
              <CardDescription>Famílias Felizes</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-orange-600">2</CardTitle>
              <CardDescription>Cidades (Porto & Matosinhos)</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>1. Descobre</CardTitle>
                <CardDescription>
                  Explora centenas de atividades adequadas à idade e interesses do teu filho
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>2. Reserva</CardTitle>
                <CardDescription>
                  Faz a reserva de forma rápida e segura, com pagamento online
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>3. Diverte-te</CardTitle>
                <CardDescription>
                  Desfruta de experiências incríveis com a tranquilidade de saber que está tudo organizado
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">A Nossa Equipa</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Somos uma equipa dedicada de pais, educadores e profissionais de tecnologia 
            que trabalham todos os dias para tornar a vida das famílias mais fácil e divertida.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">Tecnologia</Badge>
            <Badge variant="outline">Educação</Badge>
            <Badge variant="outline">Parentalidade</Badge>
            <Badge variant="outline">Comunidade</Badge>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Tens Alguma Questão?</h3>
          <p className="text-gray-600 mb-6">
            Estamos aqui para ajudar. Entra em contacto connosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contacta-nos
            </a>
            <a 
              href="/help" 
              className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Centro de Ajuda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}