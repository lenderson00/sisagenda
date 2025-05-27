import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface VercelInviteUserEmailProps {
	username?: string;
	userImage?: string;
	invitedByUsername?: string;
	invitedByEmail?: string;
	teamName?: string;
	teamImage?: string;
	randomPassword?: string;
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "";

export const SisAgendaInviteUserEmail = ({
	username,
	userImage,
	invitedByUsername,
	invitedByEmail,
	teamName,
	teamImage,
	randomPassword,
}: VercelInviteUserEmailProps) => {
	const previewText = `Convite para ${username} participar da organização no SisAgenda`;

	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="mx-auto my-auto bg-white px-2 font-sans">
					<Preview>{previewText}</Preview>
					<Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
						<Section className="mt-[32px]">
							<Img
								src={`${baseUrl}/static/vercel-logo.png`}
								width="40"
								height="37"
								alt="SisAgenda Logo"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
							Convite para <strong>{username}</strong> participar da Organização
							Militar <strong>{teamName}</strong> no <strong>SisAgenda</strong>
						</Heading>
						<Text className="text-[14px] text-black leading-[24px]">
							Olá {username},
						</Text>
						<Text className="text-[14px] text-black leading-[24px]">
							<strong>{invitedByUsername}</strong> (
							<Link
								href={`mailto:${invitedByEmail}`}
								className="text-blue-600 no-underline"
							>
								{invitedByEmail}
							</Link>
							) convidou você para participar da Organização Militar{" "}
							<strong>{teamName}</strong> no <strong>SisAgenda</strong>.
						</Text>
						<Section>
							<Row>
								<Column align="right">
									<Img
										className="rounded-full"
										src={userImage}
										width="64"
										height="64"
										alt={`Foto de perfil de ${username}`}
									/>
								</Column>
								<Column align="center">
									<Img
										src={`${baseUrl}/static/vercel-arrow.png`}
										width="12"
										height="9"
										alt="Seta indicando convite"
									/>
								</Column>
								<Column align="left">
									<Img
										className="rounded-full"
										src={teamImage}
										width="64"
										height="64"
										alt={`Logo da organização ${teamName}`}
									/>
								</Column>
							</Row>
						</Section>
						<Section className="mt-[32px] mb-[32px] text-center">
							<Button className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline">
								{randomPassword}
							</Button>
						</Section>

						<Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
						<Text className="text-[#666666] text-[12px] leading-[24px]">
							Se você não esperava este convite, pode ignorar este e-mail.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

SisAgendaInviteUserEmail.PreviewProps = {
	username: "joaosilva",
	userImage: `${baseUrl}/static/vercel-user.png`,
	invitedByUsername: "Maria",
	invitedByEmail: "maria.souza@example.com",
	teamName: "Organização Naval",
	teamImage: `${baseUrl}/static/vercel-team.png`,
	inviteLink: "https://sisagenda.com.br",
} as VercelInviteUserEmailProps;

export default SisAgendaInviteUserEmail;
