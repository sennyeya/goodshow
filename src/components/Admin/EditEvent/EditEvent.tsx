"use client";

import { FormEvent, useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import Select from "react-select";
import Header from "../../DesignSystem/Header/Header";
import Button from "../../DesignSystem/Button/Button";
import { EventWithUser } from "../../../server/db/types";
import LocationSelector from "../LocationSelector/LocationSelector";

const ALL_AGES_OPTION = {
  value: "all_ages",
  label: "All Ages",
};

const AGE_OPTIONS = [
  ALL_AGES_OPTION,
  {
    value: "16+",
    label: "16+",
  },
  {
    value: "18+",
    label: "18+",
  },
  {
    value: "21+",
    label: "21+",
  },
];

const PRIVATE_VISIBILITY = {
  value: "private",
  label: "Private",
};

const VISIBILITY_OPTIONS = [
  PRIVATE_VISIBILITY,
  {
    value: "public",
    label: "Public",
  },
];

const FORM_ITEM_CLASS = "flex flex-row justify-between my-2";
const FORM_SECTION_CLASS = "mb-4";
const FORM_SEPARATOR_CLASS = "my-4";
const FORM_SECTION_LABEL_CLASS = "text-2xl font-semibold";
const FORM_ITEM_LABEL_CLASS = "text-lg font-semibold whitespace-nowrap";
const FORM_ITEM_INPUT_CLASS = "mb-2 rounded border border-slate-500 px-2 py-1";

export default function EditEvent(options: {
  event?: EventWithUser | undefined;
}) {
  console.log(options.event?.organizerId);
  const [organizerId, setOrganizerId] = useState(
    options.event?.organizerId || ""
  );
  const [title, setTitle] = useState(options.event?.title || "");
  const [error, setError] = useState("");
  const [artists, setArtists] = useState([{}, {}]);
  const upsertEvent = trpc.event.upsertEvent.useMutation();
  const organizers = trpc.user.getAllOrganizers.useQuery();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    upsertEvent.mutate(
      {
        ...(options.event || {}),
        title,
        organizerId,
      },
      {
        onError(error, variables, context) {
          console.log(error, variables, context);
          setError(error.message);
        },
        onSuccess(data, variables, context) {
          console.log(data, variables, context);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="m-auto flex w-full max-w-4xl flex-col align-middle"
    >
      {!!error && <p>{error}</p>}
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Title</h1>
          </div>
          <div className="basis-9/12">
            <input
              className={`${FORM_ITEM_INPUT_CLASS} w-full`}
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
      </div>
      <hr className={`${FORM_SEPARATOR_CLASS}`} />
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Artists</h1>
          </div>
          <div className="basis-9/12">
            {artists.map((artist, index) => {
              return (
                <div key={artist.id}>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setArtists(artists.filter((_, i) => i !== index));
                      }}
                    >
                      Remove this artist.
                    </button>
                  )}
                  <div className="flex flex-row justify-between">
                    <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                      {index === 0 ? "Headliner" : "Support"}
                    </label>
                    <input type="text" className={`${FORM_ITEM_INPUT_CLASS}`} />
                  </div>
                  <div className="my-2 flex flex-row justify-between">
                    <label className={`${FORM_ITEM_LABEL_CLASS}`}>Link</label>
                    <input type="text" className={`${FORM_ITEM_INPUT_CLASS}`} />
                  </div>

                  {index !== artists.length - 1 && <hr className="my-4" />}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setArtists(artists.concat({}))}
            >
              Add more artists
            </button>
          </div>
        </div>
      </div>
      <hr className={`${FORM_SEPARATOR_CLASS}`} />
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Date & Time</h1>
          </div>
          <div className="basis-9/12">
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}> Doors Time</label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="time" />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}> Show Time</label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="time" />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}> Date</label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="date" />
            </div>
          </div>
        </div>
      </div>
      <hr className={`${FORM_SEPARATOR_CLASS}`} />
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Tickets</h1>
          </div>
          <div className="basis-9/12">
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Price</label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="number" />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Quantity</label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="number" />
            </div>
          </div>
        </div>
      </div>

      <hr className={`${FORM_SEPARATOR_CLASS}`} />
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Location</h1>
          </div>
          <div className="basis-9/12">
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Venue Name</label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                Venue Address
              </label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} />
            </div>
          </div>
        </div>
      </div>

      <hr className={`${FORM_SEPARATOR_CLASS}`} />
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Restrictions</h1>
          </div>
          <div className="basis-9/12">
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Age</label>
              <Select options={AGE_OPTIONS} value={ALL_AGES_OPTION} />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Venue Rules</label>
              <input type="text" className={`${FORM_ITEM_INPUT_CLASS}`} />
            </div>
          </div>
        </div>
      </div>
      <hr className={`${FORM_SEPARATOR_CLASS}`} />
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Status</h1>
          </div>
          <div className="basis-9/12">
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                Visible to Public
              </label>
              <Select options={VISIBILITY_OPTIONS} value={PRIVATE_VISIBILITY} />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                Available Date
              </label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="date" />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                Available Time
              </label>
              <input className={`${FORM_ITEM_INPUT_CLASS}`} type="time" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="rounded border border-slate-500 py-2 px-4"
        >
          {options.event ? "Edit" : "Create"} Event
        </button>
      </div>
    </form>
  );
}
