import { render, screen, fireEvent, within } from "@testing-library/react";
import TaskPage from "../pages/TaskPage";

beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    window.alert = jest.fn();
});

test("add a category", async () => {
    render(<TaskPage />);
    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));
    const categoryList = screen.getByRole("heading", { name: /categories/i }).nextElementSibling;
    expect(categoryList).toHaveTextContent("Work");
});

test("add a task", () => {
    render(<TaskPage />);

    // Add a category
    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));

    const form = screen.getByRole("form");
    const titleInput = within(form).getByLabelText(/title/i);
    const descriptionInput = within(form).getByLabelText(/description/i);
    const dueDateInput = within(form).getByLabelText(/due date/i);
    const categorySelect = within(form).getByLabelText(/category/i);

    //Create task
    fireEvent.change(titleInput, { target: { value: "My Task" } });
    fireEvent.change(descriptionInput, { target: { value: "Do something" } });
    fireEvent.change(dueDateInput, { target: { value: new Date().toISOString().split("T")[0] } });

    const firstOption = categorySelect.querySelector("option")!;
    fireEvent.change(categorySelect, { target: { value: firstOption.value } });

    fireEvent.click(within(form).getByText(/add task/i));

    expect(screen.getByText("My Task")).toBeInTheDocument();
});

test("edit a task", () => {
    render(<TaskPage />);

    // Add category and task
    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));

    const form = screen.getByRole("form");
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Task 1" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Desc 1" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    const firstOption = within(form).getByLabelText(/category/i).querySelector("option")!;
    fireEvent.change(within(form).getByLabelText(/category/i), { target: { value: firstOption.value } });
    fireEvent.click(within(form).getByText(/add task/i));

    // Edit the task
    const taskItem = screen.getByText("Task 1").closest("li");
    const editButton = within(taskItem!).getByText(/edit/i);
    fireEvent.click(editButton);

    const editForm = screen.getByRole("form");
    fireEvent.change(within(editForm).getByLabelText(/title/i), { target: { value: "Task 1 Edited" } });
    fireEvent.change(within(editForm).getByLabelText(/description/i), { target: { value: "Updated Desc" } });
    fireEvent.click(within(editForm).getByText(/update task/i));

    expect(screen.getByText("Task 1 Edited")).toBeInTheDocument();
    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
});

test("complete a task", () => {
    render(<TaskPage />);

    // Add category and task
    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));

    const form = screen.getByRole("form");
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Task 1" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Desc 1" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    const firstOption = within(form).getByLabelText(/category/i).querySelector("option")!;
    fireEvent.change(within(form).getByLabelText(/category/i), { target: { value: firstOption.value } });
    fireEvent.click(within(form).getByText(/add task/i));

    const categorySelect = within(form).getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: categorySelect.querySelector("option")!.value } });

    fireEvent.click(within(form).getByText(/add task/i));

    // Check task box
    const taskItem = screen.getByText("Task 1").closest("li")!;
    const completeCheckbox = within(taskItem).getByRole("checkbox");
    fireEvent.click(completeCheckbox);

    expect(completeCheckbox).toBeChecked();
});

test("add a subtask", () => {
    render(<TaskPage />);

    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));

    const form = screen.getByRole("form");
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Task 1" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Desc 1" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    const firstOption = within(form).getByLabelText(/category/i).querySelector("option")!;
    fireEvent.change(within(form).getByLabelText(/category/i), { target: { value: firstOption.value } });
    fireEvent.click(within(form).getByText(/add task/i));

    // Add a subtask
    const taskItem = screen.getByText("Task 1").closest("li");
    fireEvent.click(within(taskItem!).getByText(/\+ add subtask/i));

    const subtaskTitleInput = within(taskItem!).getByPlaceholderText(/subtask title/i);
    const subtaskDescInput = within(taskItem!).getByPlaceholderText(/subtask description/i);

    fireEvent.change(subtaskTitleInput, { target: { value: "Subtask 1" } });
    fireEvent.change(subtaskDescInput, { target: { value: "Subtask Desc" } });
    fireEvent.click(within(taskItem!).getByText(/add subtask/i));

    expect(screen.getByText("Subtask 1")).toBeInTheDocument();
});

test("edit a subtask", () => {
    render(<TaskPage />);

    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));

    //Add a task
    const form = screen.getByRole("form");
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Task 1" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Desc 1" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    const firstOption = within(form).getByLabelText(/category/i).querySelector("option")!;
    fireEvent.change(within(form).getByLabelText(/category/i), { target: { value: firstOption.value } });
    fireEvent.click(within(form).getByText(/add task/i));

    // Add a subtask
    const taskItem = screen.getByText("Task 1").closest("li");
    fireEvent.click(within(taskItem!).getByText(/\+ add subtask/i));
    const subtaskTitleInput = within(taskItem!).getByPlaceholderText(/subtask title/i);
    const subtaskDescInput = within(taskItem!).getByPlaceholderText(/subtask description/i);
    fireEvent.change(subtaskTitleInput, { target: { value: "Subtask 1" } });
    fireEvent.change(subtaskDescInput, { target: { value: "Subtask Desc" } });
    fireEvent.click(within(taskItem!).getByText(/add subtask/i));

    // Find the snew ubtask
    const subtaskItem = screen.getByText("Subtask 1").closest("li");

    // Click the edit button
    fireEvent.click(within(subtaskItem!).getByText(/edit/i));

    const titleInput = within(subtaskItem!).getByPlaceholderText(/subtask title/i);
    const descriptionInput = within(subtaskItem!).getByPlaceholderText(/subtask description/i);

    // Update title and description and save
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    fireEvent.change(descriptionInput, { target: { value: "Updated Description" } });
    fireEvent.click(within(subtaskItem!).getByText(/save/i));

    expect(within(subtaskItem!).getByText("Updated Title")).toBeInTheDocument();
    expect(within(subtaskItem!).getByText("Updated Description", { exact: false })).toBeInTheDocument();
});


test("complete a subtask", () => {
    render(<TaskPage />);

    window.prompt = jest.fn().mockReturnValue("Work");
    fireEvent.click(screen.getByText(/add category/i));

    //Add a task
    const form = screen.getByRole("form");
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Task 1" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Desc 1" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    const firstOption = within(form).getByLabelText(/category/i).querySelector("option")!;
    fireEvent.change(within(form).getByLabelText(/category/i), { target: { value: firstOption.value } });
    fireEvent.click(within(form).getByText(/add task/i));

    // Add a subtask
    const taskItem = screen.getByText("Task 1").closest("li");
    fireEvent.click(within(taskItem!).getByText(/\+ add subtask/i));
    const subtaskTitleInput = within(taskItem!).getByPlaceholderText(/subtask title/i);
    const subtaskDescInput = within(taskItem!).getByPlaceholderText(/subtask description/i);
    fireEvent.change(subtaskTitleInput, { target: { value: "Subtask 1" } });
    fireEvent.change(subtaskDescInput, { target: { value: "Subtask Desc" } });
    fireEvent.click(within(taskItem!).getByText(/add subtask/i))

    // Check subtask box
    const subtaskItem = screen.getByText("Subtask 1").closest("li")!;
    const subtaskCheckbox = within(subtaskItem).getByRole("checkbox");
    fireEvent.click(subtaskCheckbox);

    expect(subtaskCheckbox).toBeChecked();
});


test("filter tasks by category", () => {
    render(<TaskPage />);

    // Add categories
    window.prompt = jest.fn()
        .mockReturnValueOnce("Work")
        .mockReturnValueOnce("Personal");
    fireEvent.click(screen.getByText(/add category/i));
    fireEvent.click(screen.getByText(/add category/i));

    // Add new tasks
    const form = screen.getByRole("form");
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Work Task" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Work Desc" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    let categorySelect = within(form).getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: categorySelect.querySelectorAll("option")[0].value } });
    fireEvent.click(within(form).getByText(/add task/i));
    fireEvent.change(within(form).getByLabelText(/title/i), { target: { value: "Personal Task" } });
    fireEvent.change(within(form).getByLabelText(/description/i), { target: { value: "Personal Desc" } });
    fireEvent.change(within(form).getByLabelText(/due date/i), { target: { value: new Date().toISOString().split("T")[0] } });
    categorySelect = within(form).getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: categorySelect.querySelectorAll("option")[1].value } });
    fireEvent.click(within(form).getByText(/add task/i));

    // Get filter dropdown
    const filterCategorySelect = screen.getAllByRole("combobox")[0];

    // Filter by All - Default this is always here so it will always be index 0
    fireEvent.change(filterCategorySelect, { target: { value: filterCategorySelect.querySelectorAll("option")[0].value } });
    expect(screen.queryByText(/Work Task/, { exact: false })).toBeInTheDocument();
    expect(screen.queryByText(/Personal Task/, { exact: false })).toBeInTheDocument();

    // Filter by Work
    fireEvent.change(filterCategorySelect, { target: { value: filterCategorySelect.querySelectorAll("option")[1].value } });
    expect(screen.queryByText(/Work Task/, { exact: false })).toBeInTheDocument();
    expect(screen.queryByText(/Personal Task/, { exact: false })).not.toBeInTheDocument();

    // Filter by Personal
    fireEvent.change(filterCategorySelect, { target: { value: filterCategorySelect.querySelectorAll("option")[2].value } });
    expect(screen.queryByText(/Work Task/, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText(/Personal Task/, { exact: false })).toBeInTheDocument();
});