import { Hero } from "./_components/hero";
import { Preview } from "./_components/preview";
import Image from 'next/image'

import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { MultiStep } from "@/components/ui/multi-step";

const Dashboard = () => {
	return (
  <Container className="max-w-[calc(100vw - (100vw - 1160px) / 2)] mx-auto"><Hero>
    <Heading>
      Agendamento descomplicado
    </Heading>
    <Text>
      Conecte seu calendário e permita que as pessoas marquem agendamentos
      no seu tempo livre.
    </Text>
    <MultiStep currentStep={2} totalSteps={5} />

  </Hero>

  <Preview>
    <Image
      src={"https://github.com/rocketseat-education/06-ignite-call/blob/main/src/assets/app-preview.png?raw=true"}
      height={400}
      width={400}
      quality={100}
      priority
      alt="Calendário simbolizando aplicação em funcionamento"
    />
  </Preview>
</Container>
);
};

export default Dashboard;
