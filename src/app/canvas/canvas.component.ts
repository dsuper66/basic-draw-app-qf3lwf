import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Shape } from '../shape';
import { Point } from '../point';
import { DrawingConstants } from '../drawing-constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  constructor() { }
  @Input() shapesToDraw: Shape[];
  shapeType = 'rectangle';
  setType(type: string) { this.shapeType = type; }

  localLogging = 'Logging';

  @Input() currentShape: Subject<Shape>;

  ngOnInit() { }

  // the shape being just drawn
  createdShape: Shape;

  //Shape adjustment
  selectedShape: Shape;
  startX: number;

  logLocal(msg: String) {
    this.localLogging = msg + ".." + this.localLogging;
    console.log(msg);
  }

  addBus() {
    console.log("Add bus");
        let newBus = {
        type: this.shapeType,
        x: 50,
        y: 100,
        w: 120,
        h: 20
        };
        this.shapesToDraw.push(newBus);  
  }

  adjustSelectedShapeFor(newX: number){
    let deltaX = newX - this.startX;
    console.log (this.startX + " " + newX + " " + deltaX);
    let atRHS = (newX > this.selectedShape.x + this.selectedShape.w / 2);
    //if (deltaX > 0) {

      /*
      if (atRHS) {
        this.selectedShape.w += deltaX;
      }
      else {
        this.selectedShape.x += deltaX;
        this.selectedShape.w -= deltaX;
      }*/

      //Move shape
      this.selectedShape.x += deltaX;

      /*
    }
    else { //delta x -ve
      if (atRHS) { //shrink
        this.selectedShape.w += deltaX;
      }
      else { //LHS => grow
        this.selectedShape.x += deltaX;
        this.selectedShape.w -= deltaX;
      }
    }*/
    this.startX = newX;
  }
  startDrawingTouch(evt: TouchEvent) {
    this.logLocal("touch");
    
    let touchEvent = evt.touches[0];
    //If point is in a shape then selectedShape is set
    this.checkIfPointIsInAnyShape({x: touchEvent.pageX, y: touchEvent.pageY})
    //New shape
    if (this.selectedShape == null) {
        //non-null createdShape indicates we are drawing

        this.createdShape = {
        type: this.shapeType,
        x: touchEvent.pageX,
        y: touchEvent.pageY,
        w: 5,
        h: 5
        };
        this.shapesToDraw.push(this.createdShape);    
    }
    else { //set reference for adjusting
      this.startX = touchEvent.pageX;
    }
  }

  checkIfPointIsInAnyShape(point: Point){
    for (let thisShape of this.shapesToDraw) {
      console.log (thisShape.x);
      if (point.x > thisShape.x 
      && point.x < thisShape.x + thisShape.w
      && point.y > thisShape.y
      && point.y < thisShape.y + thisShape.h) {
        this.logLocal("inside");
        //set a non-null createdShape to indicate we are adjusting
        this.selectedShape = thisShape;
      }
    }    
  }

  startDrawing(evt: MouseEvent) { 
    this.logLocal("mouse");
    //Check if inside a shape then this is adjusting
    this.checkIfPointIsInAnyShape({x: evt.offsetX, y: evt.offsetY})
    /*
    for (let thisShape of this.shapesToDraw) {
      console.log (thisShape.x);
      if (evt.offsetX > thisShape.x && evt.offsetX < thisShape.x + thisShape.w) {
        console.log ("inside");
        //non-null createdShape indicates we are adjusting
        this.selectedShape = thisShape;
      }
    }*/
  
    //New shape
    if (this.selectedShape == null) {
        //non-null createdShape indicates we are drawing
        this.createdShape = {
        type: this.shapeType,
        x: evt.offsetX,
        y: evt.offsetY,
        w: 0,
        h: 0
        };
        this.shapesToDraw.push(this.createdShape);    
    }
    //Adjust shapeType
    else {
      //this.adjustSelectedShapeFor(evt.x)
      this.startX = evt.x;
    }
  }


  keepDrawing(evt: MouseEvent) {
    if (this.createdShape) {
      this.currentShape.next(this.createdShape);
      this.createdShape.w = evt.offsetX - this.createdShape.x;
      this.createdShape.h = evt.offsetY - this.createdShape.y;
    }
    //Adjusting shape
    else if (this.selectedShape){
      this.adjustSelectedShapeFor(evt.x)
      //this.selectedShape.w += (evt.x - this.startX)
      //this.startX = evt.x
    }
  }

    keepDrawingTouch(evt: TouchEvent) {
      let touchEvent = evt.touches[0];
      //New shape
      if (this.createdShape) {
        this.currentShape.next(this.createdShape);
        this.createdShape.w = touchEvent.pageX - this.createdShape.x;
        this.createdShape.h = touchEvent.pageY - this.createdShape.y;
      }
      //Adjusting shape
      else if (this.selectedShape){
        this.adjustSelectedShapeFor(touchEvent.pageX);
        //this.selectedShape.w += (touchEvent.pageX - this.startX)
        //this.startX = touchEvent.pageX
      }
  }

  stopDrawing() {
    this.createdShape = null;
    this.selectedShape = null;
    this.startX = 0;
  }

}