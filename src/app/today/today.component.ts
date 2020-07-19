import { Component, OnInit } from '@angular/core';
import { Task, TasksService, TaskWithID } from '../services/tasks.service';
import { NgbModal, NgbDateParserFormatter, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.css']
})
export class TodayComponent implements OnInit {

  tasksList: Array<TaskWithID> = [];
  selectedTask: Task;
  now = new Date();
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(private tasksService: TasksService,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

  ngOnInit(): void {
    this.tasksService.getAll().then((tasks: Array<TaskWithID>) => {
      let gmt3 = this.now.getTime() + 10800000

      // get today's tasks
      tasks.forEach(task => {
        let fromDate = new Date(this.formatter.format(task.from_date));
        let toDate = new Date(this.formatter.format(task.to_date));

        if (gmt3 >= fromDate.getTime() && gmt3 <= toDate.getTime()) {
          this.tasksList = [...this.tasksList, task];
        }
      });

      // initial dumb task
      if (tasks.length === 0) {
        let id: TaskWithID;
        const task: Task = {
          title: 'Başlangıç Görevi',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque ornare aenean euismod elementum nisi quis. Ultricies mi eget mauris pharetra. Tortor condimentum lacinia quis vel. Aliquet nec ullamcorper sit amet risus nullam eget. Tincidunt nunc pulvinar sapien et ligula. Mi bibendum neque egestas congue quisque egestas diam in. Nunc id cursus metus aliquam eleifend mi in nulla. Consequat nisl vel pretium lectus quam. Mi bibendum neque egestas congue quisque egestas diam in arcu. Feugiat in fermentum posuere urna nec tincidunt praesent semper feugiat. Consequat ac felis donec et odio pellentesque diam volutpat. Orci eu lobortis elementum nibh. Mi eget mauris pharetra et ultrices.',
          done: false,
          from_date: this.calendar.getPrev(this.fromDate, 'd', 1),
          to_date: this.calendar.getNext(this.fromDate, 'd', 3),
          updated_at: new Date(),
        };
        this.tasksList = [...this.tasksList, Object.assign({}, task, id)];
      }
    });
  }

  // modal open
  open(content, selectedTask: Task = null) {
    this.selectedTask = selectedTask;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}