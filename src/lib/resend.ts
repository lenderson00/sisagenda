import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, reactEmail: React.ReactNode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      react: reactEmail,
    });
    return { data, error };
  } catch (error) {
    console.error(error);
    return { data: null, error: error };
  }
};