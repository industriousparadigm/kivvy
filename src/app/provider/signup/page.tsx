import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Star, 
  Shield, 
  TrendingUp, 
  Clock, 
  Heart, 
  CheckCircle 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Torne-se Prestador | KidsHiz',
  description: 'Junte-se à KidsHiz como prestador de atividades para crianças. Alcance mais famílias e faça crescer o seu negócio.',
};

export default function ProviderSignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Building className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Torne-se um Prestador KidsHiz</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Junte-se à nossa rede de prestadores e alcance milhares de famílias à procura 
            de atividades de qualidade para os seus filhos.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Porque Escolher a KidsHiz?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Mais Clientes</h3>
                <p className="text-gray-600">
                  Aceda a uma base de milhares de famílias ativas à procura de atividades para crianças.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Crescimento</h3>
                <p className="text-gray-600">
                  Faça crescer o seu negócio com ferramentas de gestão e marketing integradas.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Suporte Dedicado</h3>
                <p className="text-gray-600">
                  Apoio contínuo da nossa equipa para o ajudar a ter sucesso na plataforma.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
                <div className="text-gray-600">Famílias Registadas</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Prestadores Ativos</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
                <div className="text-gray-600">Reservas Mensais</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
                <div className="text-gray-600">Avaliação Média</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate-se Agora</CardTitle>
              <CardDescription>
                Preencha o formulário para iniciar o processo de candidatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações Pessoais</h3>
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
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" placeholder="+351 912 345 678" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações do Negócio</h3>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nome do Negócio</Label>
                    <Input id="businessName" placeholder="Nome da sua empresa/organização" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de Negócio</Label>
                    <Input id="businessType" placeholder="Ex: Escola de Dança, Academia de Desporto" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" placeholder="Porto, Matosinhos, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Anos de Experiência</Label>
                      <Input id="experience" placeholder="Ex: 5 anos" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Negócio</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Conte-nos sobre a sua empresa e as atividades que oferece..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Atividades Oferecidas</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Desporto', 'Dança', 'Música', 'Arte', 'Programação', 'Idiomas', 'Ciência', 'Teatro', 'Culinária'].map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox id={activity} />
                        <Label htmlFor={activity} className="text-sm">{activity}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Documentos</h3>
                  <p className="text-sm text-gray-600">Será necessário enviar os seguintes documentos:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Certificado de registo da empresa</li>
                    <li>• Seguro de responsabilidade civil</li>
                    <li>• Certificados de qualificação relevantes</li>
                    <li>• Referências (se aplicável)</li>
                  </ul>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    Concordo com os <a href="/terms" className="text-blue-600 hover:underline">Termos de Serviço</a> e 
                    <a href="/privacy" className="text-blue-600 hover:underline"> Política de Privacidade</a>
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Enviar Candidatura
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Process and Requirements */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Processo de Candidatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Submissão</h4>
                      <p className="text-sm text-gray-600">Preencha e envie o formulário de candidatura</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Revisão</h4>
                      <p className="text-sm text-gray-600">A nossa equipa revisa a sua candidatura (2-3 dias)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Verificação</h4>
                      <p className="text-sm text-gray-600">Verificamos documentos e referências</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Aprovação</h4>
                      <p className="text-sm text-gray-600">Começa a aceitar reservas na plataforma</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Requisitos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Empresa registada em Portugal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Seguro de responsabilidade civil</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Qualificações relevantes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Localização no Porto ou Matosinhos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Compromisso com a qualidade</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Vantagens da Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Gestão de reservas automatizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Pagamentos seguros e rápidos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Ferramentas de marketing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Suporte ao cliente 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span>Sistema de avaliações</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}