import EditEvent from "../../../../src/components/Admin/EditEvent/EditEvent";
import { getEvent } from "../../../../src/server/rpc/event";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);
  return <EditEvent event={event} />;
}
