import AssessmentInvite from "@/components/assessment/AssessmentInvite";

export default async function AssessmentInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <AssessmentInvite token={token} />;
}
