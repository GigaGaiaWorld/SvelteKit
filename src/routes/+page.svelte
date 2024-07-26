<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";

    import * as Card from "$lib/components/ui/card/index.js";
    import type { Todo } from "../types"
    export let data;

    let newTodo = "";
    let checked=false;
    console.log("page.svelte:", data);

	async function addNewTodo() {
		const description = newTodo;
    
		if (description.length < 5) {
			alert("at least 5 letters!");
			return;
		}
		const response = await fetch('http://127.0.0.1:8000/todos/post', {
			method: 'POST',
			body: JSON.stringify({ description }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const id = await response.json();
		console.log(id);
		// const id = crypto.randomUUID();
		data.data = [...data.data, {
			id,
			description
		}];
        console.log('Updated todos after deletion:', data);

		newTodo = '';
	}

    async function cancelTodo() {
        newTodo = '';
    }

	async function handleCheckboxChange(todo:Todo) {
		const done = !checked;
		await fetch(`http://127.0.0.1:8000/todos/${todo.id}`, {
			method: 'PUT',
			body: JSON.stringify({ done }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async function handleDeleteClick(todo:Todo) {
		await fetch(`http://127.0.0.1:8000/todos/${todo.id}`, {
			method: 'DELETE'
		});

		data.data = data.data.filter((t: Todo) => t !== todo);
	}
      </script>

  <div class="flex min-h-screen w-full flex-col items-center">
    <div class="h-10"></div>
    <Card.Root class="w-[350px]">
        <Card.Header>
        <Card.Title>Create Todos</Card.Title>
        <Card.Description>Deploy your new todo in one-click.</Card.Description>
        </Card.Header>
        <Card.Content>
        <form>
            <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
                <Label for="name">Title</Label>
                <Input id="name" 
                       placeholder="create new todo"
                       bind:value={newTodo} />
            </div>
            </div>
        </form>
        </Card.Content>
        <Card.Footer class="flex justify-between">
        <Button variant="outline" on:click={cancelTodo}>Cancel</Button>
        <Button on:click={addNewTodo}>Add</Button>
    </Card.Footer>
    <div class="w-[350px] mt-8">
        <ul>
            {#each data.data as d (d.id)}
            <li class="flex items-center justify-between p-2 border-b">
                <div class="flex items-center space-x-2">
                    <Checkbox 
                        id="terms-{d.id}" 
                        checked={d.done}
                        aria-labelledby="terms-label-{d.id}" 
                        on:click={() => handleCheckboxChange(d)}/>
                    <Label
                    id="terms-label-{d.id}"
                    for="terms-{d.id}"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    {d.description}
                    </Label>
                </div>
                <Button on:click={() => handleDeleteClick(d)} class="ml-2">Delete</Button>
            </li>
            {/each}
        </ul>
    </div>
    </Card.Root>

  </div>
