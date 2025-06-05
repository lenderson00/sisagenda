import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SisAgendaResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const SisAgendaResetPasswordEmail = ({
  userFirstname,
  resetPasswordLink,
}: SisAgendaResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Redefinição de senha do SisAgenda</Preview>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/sisagenda-logo.png`}
            width="40"
            height="33"
            alt="SisAgenda"
          />
          <Section>
            <Text style={text}>Olá {userFirstname},</Text>
            <Text style={text}>
              Recebemos uma solicitação para redefinir a senha da sua conta no
              SisAgenda. Se foi você, clique no botão abaixo para criar uma nova
              senha:
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Redefinir senha
            </Button>
            <Text style={text}>
              Se você não solicitou a redefinição de senha, pode ignorar este
              e-mail com segurança.
            </Text>
            <Text style={text}>
              Para manter sua conta segura, não compartilhe este e-mail com
              ninguém. Em caso de dúvidas, acesse o suporte do SisAgenda.
            </Text>
            <Text style={text}>Equipe SisAgenda</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

SisAgendaResetPasswordEmail.PreviewProps = {
  userFirstname: "Alan",
  resetPasswordLink: "https://sisagenda.com/resetar-senha",
} as SisAgendaResetPasswordEmailProps;

export default SisAgendaResetPasswordEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};
