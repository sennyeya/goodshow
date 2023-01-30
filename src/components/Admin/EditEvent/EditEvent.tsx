"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker, DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import type {
  Event as DbEvent,
  Location,
  Artist as DbArtist,
  TicketOffering,
} from "@prisma/client";

type PopulatedEvent = DbEvent & {
  location: Location;
  artists: DbArtist[];
  ticketOfferings: TicketOffering[];
};

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

interface Event {
  id: string;
  title: string;
  opensAt: Date;
  date: {
    doors: Date;
    show: Date;
    date: Date;
  };
  tickets: {
    id: string;
    price: number;
    quantity: number;
  };
  location: {
    id: string;
    name: string;
    address: string;
  };
  restrictions: {
    age: "all" | "16+" | "18+" | "21+";
    rules: string;
  };
}

interface Artist {
  id: string;
  link: string;
  name: string;
}

export default function EditEvent({
  event,
}: {
  event?: PopulatedEvent | undefined;
}) {
  const upsertEvent = trpc.event.upsertEvent.useMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<{ event: Event; artists: Artist[] }>({
    defaultValues: {
      event: {
        id: event?.id,
        title: event?.title,
        opensAt: new Date(),
        date: {
          doors: event?.doorsTime ?? new Date(),
          show: event?.startTime ?? new Date(),
          date: event?.doorsTime ?? new Date(),
        },
        location: {
          id: event?.location?.id,
          name: event?.location?.name,
          address: event?.location?.address,
        },
        tickets: {
          id: event?.ticketOfferings?.[0]?.id ?? "",
          price: event?.ticketOfferings?.[0]?.price,
          quantity: event?.ticketOfferings?.[0]?.quantity_max,
        },
        restrictions: {
          age: event?.ageRestriction,
          rules: event?.rules,
        },
        ...event,
      },
      artists: event?.artists ?? [
        { id: "", link: "", name: "" },
        { id: "", link: "", name: "" },
      ],
    },
  });
  const artists = watch("artists");
  const onSubmit = ({
    event,
    artists,
  }: {
    event: Event;
    artists: Artist[];
  }) => {
    upsertEvent.mutate(
      { event, artists },
      {
        onError(error, variables, context) {
          console.log(error, variables, context);
          //setError(error.message);
        },
        onSuccess(data, variables, context) {
          console.log(data, variables, context);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-auto flex w-full max-w-4xl flex-col align-middle"
    >
      {JSON.stringify(event?.ticketOfferings)}
      <div className={`${FORM_SECTION_CLASS}`}>
        <div className="flex flex-row">
          <div className="basis-3/12">
            <h1 className={`${FORM_SECTION_LABEL_CLASS}`}>Title</h1>
          </div>
          <div className="basis-9/12">
            <input
              {...register("event.title")}
              className={`${FORM_ITEM_INPUT_CLASS} w-full`}
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
                <div key={artist.name}>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setValue(
                          "artists",
                          artists.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      Remove this artist. {index}
                    </button>
                  )}
                  <div className="flex flex-row justify-between">
                    <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                      {index === 0 ? "Headliner" : "Support"}
                    </label>
                    <input
                      {...register(`artists.${index}.name`)}
                      className={`${FORM_ITEM_INPUT_CLASS}`}
                    />
                  </div>
                  <div className="my-2 flex flex-row justify-between">
                    <label className={`${FORM_ITEM_LABEL_CLASS}`}>Link</label>
                    <input
                      {...register(`artists.${index}.link`)}
                      className={`${FORM_ITEM_INPUT_CLASS}`}
                    />
                  </div>

                  {index !== artists.length - 1 && <hr className="my-4" />}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setValue(
                  "artists",
                  artists.concat({ id: "", link: "", name: "" })
                )
              }
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
              <Controller
                name="event.date.doors"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <TimePicker
                      onChange={onChange}
                      renderInput={(params) => <TextField {...params} />}
                      {...restField}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}> Show Time</label>
              <Controller
                name="event.date.show"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <TimePicker
                      onChange={onChange}
                      renderInput={(params) => <TextField {...params} />}
                      {...restField}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}> Date</label>
              <Controller
                name="event.date.date"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DatePicker
                      onChange={onChange}
                      renderInput={(params) => <TextField {...params} />}
                      {...restField}
                    />
                  </LocalizationProvider>
                )}
              />
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
              <input
                {...register("event.tickets.price", { valueAsNumber: true })}
                className={`${FORM_ITEM_INPUT_CLASS}`}
              />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Quantity</label>
              <input
                {...register("event.tickets.quantity", { valueAsNumber: true })}
                className={`${FORM_ITEM_INPUT_CLASS}`}
              />
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
              <input
                {...register("event.location.name")}
                className={`${FORM_ITEM_INPUT_CLASS}`}
              />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>
                Venue Address
              </label>
              <input
                {...register("event.location.address")}
                className={`${FORM_ITEM_INPUT_CLASS}`}
              />
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
              <Controller
                name="event.restrictions.age"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={AGE_OPTIONS}
                    value={ALL_AGES_OPTION}
                  />
                )}
              />
            </div>
            <div className={`${FORM_ITEM_CLASS}`}>
              <label className={`${FORM_ITEM_LABEL_CLASS}`}>Venue Rules</label>
              <input
                {...register("event.restrictions.rules")}
                className={`${FORM_ITEM_INPUT_CLASS}`}
              />
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
                Available Date/Time
              </label>
              <Controller
                name="event.opensAt"
                control={control}
                render={({ field: { onChange, ...restField } }) => (
                  <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <DateTimePicker
                      onChange={onChange}
                      renderInput={(params) => <TextField {...params} />}
                      {...restField}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="rounded border border-slate-500 py-2 px-4"
        >
          {event ? "Edit" : "Create"} Event
        </button>
      </div>
    </form>
  );
}
