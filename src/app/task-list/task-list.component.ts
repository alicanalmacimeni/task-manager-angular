import { Component, OnInit } from '@angular/core';
import { Task, TasksService, TaskWithID } from '../services/tasks.service';
import { NgbModal, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasksList: Array<TaskWithID> = [];
  closeResult = '';
  selectedTask: Task;
  searchInput: string;

  // datepicker data
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(private tasksService: TasksService,
    private modalService: NgbModal,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    this.tasksService.getAll().then((tasks: Array<TaskWithID>) => {
      this.tasksList = tasks;

      // initial dumb task
      if (tasks.length === 0) {
        let id: TaskWithID;
        const task: Task = {
          title: 'Başlangıç Görevi',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque ornare aenean euismod elementum nisi quis. Ultricies mi eget mauris pharetra. Tortor condimentum lacinia quis vel. Aliquet nec ullamcorper sit amet risus nullam eget. Tincidunt nunc pulvinar sapien et ligula. Mi bibendum neque egestas congue quisque egestas diam in. Nunc id cursus metus aliquam eleifend mi in nulla. Consequat nisl vel pretium lectus quam. Mi bibendum neque egestas congue quisque egestas diam in arcu. Feugiat in fermentum posuere urna nec tincidunt praesent semper feugiat. Consequat ac felis donec et odio pellentesque diam volutpat. Orci eu lobortis elementum nibh. Mi eget mauris pharetra et ultrices.',
          done: false,
          from_date: this.fromDate,
          to_date: this.toDate,
          updated_at: new Date(),
        };
        this.tasksList = [...this.tasksList, Object.assign({}, task, id)];
      }
    });


  }

  ngDoCheck(): void {
    if (this.searchInput === '') { // when deleted entire input in search box
      this.tasksService.getAll().then((tasks: Array<TaskWithID>) => {
        this.tasksList = tasks;
      });
      this.searchInput = null;
    }
  }

  // modal open
  open(content, selectedTask: Task = null) {
    this.selectedTask = selectedTask;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // add or update task
  onAddTask(e, id: number = -1) {
    e.preventDefault();
    let now: Date = new Date();

    const task: Task = {
      title: e.target.title.value,
      description: e.target.description.value,
      done: false,
      from_date: this.fromDate,
      to_date: this.toDate ?? this.calendar.getNext(this.fromDate, 'd', 1),
      updated_at: now,
    };
    if (id !== -1) {  // update task
      this.tasksService
        .update(id, task)
        .then((id) => {
          this.tasksList = [...this.tasksList, Object.assign({}, task, { id })];
          this.ngOnInit();
        });
    } else {  // add a new task 
      this.tasksService
        .add(task)
        .then((id) => {
          this.tasksList = [...this.tasksList, Object.assign({}, task, { id })];
        });
    }
    this.modalService.dismissAll();
  }

  // remove task
  onDeleteTask(id: number) {
    this.tasksService.remove(id).then(() => {
      this.tasksList = this.tasksList.filter((todo) => todo.id !== id);
    })
  }

  // search tasks
  searchTask() {
    if (this.searchInput) {
      this.tasksService.search(this.searchInput).then((res) => {
        this.tasksList = res
      })
    }
  }

  // datepicker
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  isActive(task) {
    let toDate = new Date(this.formatter.format(task.to_date));
    let gmt3 = new Date().getTime() + 10800000

    if (gmt3 >= toDate.getTime()) {
      return false
    }
    return true
  }
}
