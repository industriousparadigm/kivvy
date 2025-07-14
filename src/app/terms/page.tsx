import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Scale,
  CreditCard,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Serviço | Kivvy',
  description:
    'Termos de serviço da Kivvy. Conheça as condições de utilização da nossa plataforma.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Termos de Serviço
          </h1>
          <p className="text-lg text-gray-600">
            Última atualização: 11 de Julho de 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Introdução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Bem-vindo à Kivvy! Estes termos de serviço (&quot;Termos&quot;)
              regem a utilização da nossa plataforma online localizada em
              www.kivvy.pt e dos serviços relacionados (coletivamente, os
              &quot;Serviços&quot;).
            </p>
            <p className="text-gray-700">
              Ao aceder e utilizar os nossos Serviços, concorda em ficar
              vinculado por estes Termos. Se não concordar com estes Termos, não
              deve utilizar os nossos Serviços.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Descrição dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              A Kivvy é uma plataforma online que conecta pais e encarregados de
              educação com prestadores de atividades para crianças na área do
              Porto e Matosinhos. Os nossos serviços incluem:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pesquisa e navegação de atividades para crianças</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Sistema de reservas e pagamentos online</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Gestão de perfis de família e crianças</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Comunicação entre pais e prestadores</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Sistema de avaliações e comentários</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Responsabilidades do Utilizador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Registo e Conta</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Deve fornecer informações precisas e completas durante o
                    registo
                  </li>
                  <li>
                    Deve manter a confidencialidade das suas credenciais de
                    acesso
                  </li>
                  <li>
                    É responsável por todas as atividades que ocorrem na sua
                    conta
                  </li>
                  <li>
                    Deve notificar-nos imediatamente sobre qualquer utilização
                    não autorizada
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Utilização Aceitável
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Utilizar os Serviços apenas para fins legais e legítimos
                  </li>
                  <li>
                    Não interferir com o funcionamento normal da plataforma
                  </li>
                  <li>Não tentar aceder a áreas restritas sem autorização</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings and Payments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Reservas e Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Processo de Reserva
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    As reservas são consideradas confirmadas após o pagamento
                    bem-sucedido
                  </li>
                  <li>
                    Receberá uma confirmação por email com os detalhes da
                    reserva
                  </li>
                  <li>
                    A disponibilidade das atividades está sujeita a confirmação
                    do prestador
                  </li>
                  <li>
                    Promoções e descontos têm termos e condições específicos
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Política de Pagamento
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-blue-900 font-medium mb-2">
                    Métodos de Pagamento Aceites:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Cartão de Crédito</Badge>
                    <Badge>Cartão de Débito</Badge>
                    <Badge>MBWay</Badge>
                    <Badge>Transferência Bancária</Badge>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Todos os pagamentos são processados de forma segura</li>
                  <li>
                    Os preços estão sujeitos a alterações sem aviso prévio
                  </li>
                  <li>Taxas adicionais podem aplicar-se conforme indicado</li>
                  <li>Reembolsos seguem a nossa política de cancelamento</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Política de Cancelamento
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium text-green-900">
                        Cancelamento até 24h antes
                      </span>
                      <p className="text-sm text-green-700">Reembolso total</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      100%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <span className="font-medium text-yellow-900">
                        Cancelamento 12-24h antes
                      </span>
                      <p className="text-sm text-yellow-700">
                        Reembolso parcial
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-yellow-600 border-yellow-600"
                    >
                      50%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <span className="font-medium text-red-900">
                        Cancelamento com menos de 12h
                      </span>
                      <p className="text-sm text-red-700">Sem reembolso</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-600"
                    >
                      0%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Limitação de Responsabilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-900 font-medium mb-2">Importante:</p>
                <p className="text-yellow-800 text-sm">
                  A Kivvy atua como intermediário entre pais e prestadores de
                  atividades. Não somos responsáveis pela qualidade, segurança
                  ou adequação das atividades oferecidas.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Os prestadores são responsáveis pela segurança e qualidade das
                  suas atividades
                </li>
                <li>
                  Recomendamos que verifique sempre as credenciais dos
                  prestadores
                </li>
                <li>
                  A nossa responsabilidade limita-se ao valor pago pela reserva
                </li>
                <li>
                  Não nos responsabilizamos por danos indiretos ou
                  consequenciais
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Propriedade Intelectual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Todos os conteúdos da plataforma Kivvy, incluindo textos,
              gráficos, logotipos, ícones, imagens, áudio e software, são
              propriedade da Kivvy ou dos seus licenciadores e estão protegidos
              por leis de direitos de autor e outras leis de propriedade
              intelectual.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Não pode reproduzir, distribuir ou modificar conteúdos sem
                autorização
              </li>
              <li>
                Pode utilizar o conteúdo apenas para fins pessoais e não
                comerciais
              </li>
              <li>Qualquer violação pode resultar em ação legal</li>
            </ul>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Suspensão e Rescisão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Reservamo-nos o direito de suspender ou rescindir a sua conta
                se:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Violar estes Termos de Serviço</li>
                <li>Fornecer informações falsas ou enganosas</li>
                <li>Envolver-se em atividades fraudulentas ou ilegais</li>
                <li>Comprometer a segurança da plataforma</li>
              </ul>
              <p className="text-gray-700">
                Pode também cancelar a sua conta a qualquer momento
                contactando-nos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes and Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Alterações e Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Alterações aos Termos
                </h3>
                <p className="text-gray-700">
                  Reservamo-nos o direito de modificar estes Termos a qualquer
                  momento. As alterações entram em vigor após a publicação no
                  site. A utilização continuada dos Serviços constitui aceitação
                  dos novos Termos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Contacto</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-900 font-medium mb-2">
                    Para questões sobre estes Termos:
                  </p>
                  <p className="text-blue-800">Email: legal@kivvy.pt</p>
                  <p className="text-blue-800">Telefone: +351 220 123 456</p>
                  <p className="text-blue-800">Endereço: Porto, Portugal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
