<script lang="ts">
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import type { Event } from "../../types";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
    import { writable } from "svelte/store";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  export let data;

  let value: DateValue | undefined = undefined;
  let eventText = "";
  let eventType;
  const type_list = [
    { value: "work", label: "Work" },
    { value: "festival", label: "Festival" },
    { value: "party", label: "Party" }
  ];

  async function addNewEvent() {
    let eventTypeValue = eventType?.value;
    console.log("value:",value?.toString());
    console.log("eventText:",eventText);
    console.log("eventType:",eventTypeValue);
    const response = await fetch("http://127.0.0.1:8000/calendar/post", {
      method: "POST",
      body: JSON.stringify({ date:value?.toString(), event:eventText, event_type:eventTypeValue}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const id = await response.json();
    data.data = [
      ...data.data,
      {
        id,
        value,
        eventText,
        eventTypeValue
      },
    ];
    console.log("Updated calendar after deletion:", data);
    eventText = "";
  }

  async function handleDeleteClick(event: Event) {
    await fetch(`http://127.0.0.1:8000/calendar/${event.id}`, {
      method: "DELETE",
    });

    data.data = data.data.filter((t: Event) => t !== event);
  }

</script>
<div class="flex flex-col items-center p-4">

  <div>
    <Popover.Root>
      <Popover.Trigger asChild let:builder>
        <Button
          variant="outline"
          class={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          builders={[builder]}
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
        </Button>
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0">
        <Calendar bind:value initialFocus />
      </Popover.Content>
    </Popover.Root>
    <div class="h-3"></div>

    <Textarea class="w-[300px]" bind:value={eventText} placeholder="Type your new event here." />
    <div class="h-3"></div>

    <div class="flex justify-between">
      <Select.Root portal={null} bind:selected={eventType}>
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder="event type" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>are you sure?</Select.Label>
            {#each type_list as ty}
              <Select.Item value={ty.value} label={ty.label}
                >{ty.label}</Select.Item>
            {/each}
          </Select.Group>
        </Select.Content>
        <Select.Input hidden/>
      </Select.Root>

      <Button class="block w-[100px] mb-4 text-left" on:click={addNewEvent}>Add Event</Button>
    </div>
    <p>Selected value: {eventType?.value}</p>

    <Accordion.Root class="w-full sm:max-w-[70%]">
      {#each data.data as event, index}
      <div class="flex justify-between">
        <Accordion.Item value="item-{index}">
          <Accordion.Trigger>{event.event}</Accordion.Trigger>
          <Accordion.Content
            >date: {event.date.split('T')[0]} | type: {event.event_type}</Accordion.Content
          >
        </Accordion.Item>
        <Button on:click={() => handleDeleteClick(event)}>Delete</Button>
      </div>

      {/each}
    </Accordion.Root>

  </div>

</div>

