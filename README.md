# Ng Plan Layout

This project was made with Angular version 14.2.8 and pinch-zoom-js version 2.3.5.
Use NPM to provide related node_modules in your application.

## General

Allows manipulation and positioning of components within an image.

Working example:

https://picture-milestones.web.app

Example screenshots:

![alt text](https://github.com/j-lafaye/ng-plan-layout/blob/main/demo/mobile.png)

![alt text](https://github.com/j-lafaye/ng-plan-layout/blob/main/demo/tablet.png)

## Code
### Information
To run this component in your Angular application, make sure you installed pinch-zoom-js 2.3.5 library.
Note that PlanLayoutMilestoneComponent works with coordinates expressed in percentage regarding position in its parent.

### Implementation
```
<app-plan-layout
	[image]="'./assets/images/plan.png'">

	<app-plan-layout-milestone
		[x-position]="z.coords.xPosition"
		[x-slot]="z.coords.xSlot"
		[y-position]="z.coords.yPosition"
		[y-slot]="z.coords.ySlot"
		*ngFor="let z of zones">
		
		<!-- put whatever you want here :) -->
		
	</app-plan-layout-milestone>
	
</app-plan-layout>
```
