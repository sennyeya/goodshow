import { useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import Async from "react-select/async";

export default function EventCreate() {
  const [organizerId, setOrganizerId] = useState("");
  const [title, setTitle] = useState("Event Title");
  const createEvent = trpc.event.createEvent.useMutation();
  const organizers = trpc.user.getAllOrganizers.useQuery();
  const handleSubmit = () => {
    createEvent.mutate({
      title,
      organizerId,
    });
    return null;
  };

  console.log(organizers.data);
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Event title:</label>
      <input
        type="text"
        id="title"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="organizer">Organizer:</label>
      <Async
        onChange={(item) => setOrganizerId(item?.value || "")}
        defaultOptions={organizers.data?.map((e) => ({
          value: e.id,
          label: e.email,
        }))}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
