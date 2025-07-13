import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, UserCheck, Database, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade | KidsHiz',
  description: 'Política de privacidade da KidsHiz. Saiba como protegemos e utilizamos os seus dados pessoais.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
          <p className="text-lg text-gray-600">
            Última atualização: 11 de Julho de 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Compromisso com a Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              A KidsHiz está comprometida com a proteção da sua privacidade e dos seus dados pessoais. 
              Esta política explica como recolhemos, utilizamos, armazenamos e protegemos as suas informações 
              quando utiliza a nossa plataforma.
            </p>
            <p className="text-gray-700">
              Esta política aplica-se ao website www.kidshiz.pt e a todos os serviços relacionados. 
              Ao utilizar os nossos serviços, concorda com as práticas descritas nesta política.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Informações que Recolhemos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Informações Pessoais</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Nome completo e informações de contacto (email, telefone)</li>
                  <li>Informações de faturação e pagamento</li>
                  <li>Informações sobre os seus filhos (nome, idade, necessidades especiais)</li>
                  <li>Preferências e historico de atividades</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Informações Técnicas</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Endereço IP e localização geográfica</li>
                  <li>Tipo de navegador e dispositivo</li>
                  <li>Páginas visitadas e tempo de navegação</li>
                  <li>Cookies e identificadores semelhantes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              Como Utilizamos os Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Finalidades Primárias</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Processar reservas e pagamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comunicar sobre atividades e reservas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Fornecer suporte ao cliente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Personalizar a experiência do utilizador</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Finalidades Secundárias</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Melhorar os nossos serviços</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Análise estatística e investigação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Marketing (com consentimento)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Cumprimento de obrigações legais</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Segurança e Proteção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Medidas Técnicas</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Encriptação SSL/TLS</li>
                    <li>• Armazenamento seguro</li>
                    <li>• Firewalls e monitorização</li>
                    <li>• Backup regular</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Medidas Organizacionais</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Acesso restrito aos dados</li>
                    <li>• Formação de segurança</li>
                    <li>• Políticas internas</li>
                    <li>• Auditorias regulares</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Os Seus Direitos</CardTitle>
            <CardDescription>Sob o RGPD, tem vários direitos relativamente aos seus dados pessoais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Acesso</Badge>
                  <span className="text-sm">Consultar os seus dados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Retificação</Badge>
                  <span className="text-sm">Corrigir dados incorretos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Apagamento</Badge>
                  <span className="text-sm">Solicitar remoção</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Portabilidade</Badge>
                  <span className="text-sm">Transferir os seus dados</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Limitação</Badge>
                  <span className="text-sm">Restringir o processamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Oposição</Badge>
                  <span className="text-sm">Opor-se ao processamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Revogação</Badge>
                  <span className="text-sm">Retirar consentimento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Reclamação</Badge>
                  <span className="text-sm">Apresentar queixa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-600" />
              Cookies e Tecnologias Semelhantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência, 
              analisar o tráfego e personalizar o conteúdo. Pode gerir as suas preferências de cookies 
              a qualquer momento.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Cookies Essenciais</span>
                  <p className="text-sm text-gray-600">Necessários para o funcionamento do site</p>
                </div>
                <Badge>Sempre Ativos</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Cookies de Análise</span>
                  <p className="text-sm text-gray-600">Ajudam-nos a entender como utiliza o site</p>
                </div>
                <Badge variant="outline">Opcionais</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">Cookies de Marketing</span>
                  <p className="text-sm text-gray-600">Utilizados para mostrar publicidade relevante</p>
                </div>
                <Badge variant="outline">Opcionais</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
            <CardDescription>Para questões sobre privacidade e proteção de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Se tiver alguma questão sobre esta política de privacidade ou quiser exercer os seus direitos, 
                pode contactar-nos:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="font-semibold text-blue-900">Encarregado de Proteção de Dados</p>
                <p className="text-blue-800">Email: privacidade@kidshiz.pt</p>
                <p className="text-blue-800">Telefone: +351 220 123 456</p>
              </div>
              <p className="text-sm text-gray-600">
                Tem também o direito de apresentar uma reclamação à Comissão Nacional de Proteção de Dados (CNPD) 
                se considerar que os seus dados pessoais não estão a ser tratados em conformidade com a lei.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}