import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Main } from './main.model';
import { MainService } from './main.service';
import { Router } from '../../../../node_modules/@angular/router';

declare const $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [routerTransition()]
})
export class MainComponent implements OnInit {

    // START: MainComponent properties declation
    mainModel: Main;
    workoutProgramId: string;
    workoutProgramName: string;
    workoutProgramScheduleUnit: string;
    workoutProgramScheduleUnitValue: number;
    workoutProgramSchedule: any;
    exerciseName: string;
    exerciseDuration: string;
    exercises: Array<any>;
    formMsg: string;
    athlete: string;
    welcomeUser: string;
    athletePrograms: any;
    formHeaderLabel: string;
    formSaveButtonLabel: string;
    isformActionCreate: Boolean;
    isExerciseForUpdate: Boolean;
    // END: MainComponent properties declation

    constructor(
        private router: Router,
        private mainService: MainService
    ) {
        this.clearFormData();
        this.athlete = localStorage.getItem('athlete');
    }

    ngOnInit() {
        this.getAthleteSavedPrograms();
    }

    /**
     * Check athlete's saved profile
     */
    getAthleteSavedPrograms() {
        $('#loadingScreen').fadeIn('fast');
        this.mainService.getUserData(this.athlete)
            .subscribe(
                res => {
                    const response: any = res;
                    const arrayOfFormattedResponse: Array<any> = new Array();
                    const formattedResponse = (id, programName, programDuration, programDurationRaw, programSchedule, exercises) => {
                        {
                            const data = {
                                id: id,
                                programName: programName,
                                programDuration: programDuration,
                                programDurationRaw: programDurationRaw,
                                programSchedule: programSchedule,
                                exercises: exercises
                            };
                            return data;
                        }
                    };

                    if (response.result.Count > 0) {
                        $('.emptyBox').fadeOut('fast');
                        this.welcomeUser = 'Welcome back ' + localStorage.getItem('athlete');
                        this.athletePrograms = response.result.Items;

                        this.athletePrograms.forEach(item => {
                            let schedule = '';
                            if (item.programSchedule.Mon) {
                                schedule += 'Mon ';
                            }
                            if (item.programSchedule.Tue) {
                                schedule += 'Tue ';
                            }
                            if (item.programSchedule.Wed) {
                                schedule += 'Wed ';
                            }
                            if (item.programSchedule.Thu) {
                                schedule += 'Thu ';
                            }
                            if (item.programSchedule.Fri) {
                                schedule += 'Fri ';
                            }
                            if (item.programSchedule.Sat) {
                                schedule += 'Sat ';
                            }
                            if (item.programSchedule.Sun) {
                                schedule += 'Sun ';
                            }
                            const data = formattedResponse(item.id, item.programName, item.programDuration, item.programDurationRaw, schedule, item.programExercises);
                            arrayOfFormattedResponse.push(data);
                        });
                        this.athletePrograms = arrayOfFormattedResponse;
                    } else {
                        this.welcomeUser = 'Welcome ' + localStorage.getItem('athlete');
                        $('.emptyBox').fadeIn('fast');
                    }
                },
                err => {
                    console.log(err);
                },
                () => {
                    $('#loadingScreen').fadeOut('fast');
                }
            );
    }

    /**
     * Filters display by day
     * @param event expects click event
     */
    filterPrograms(event: any) {
        const day = event.target.innerText;

        // Disaply all boxes first
        this.athletePrograms.forEach(item => {
           $('#' + item.id).show();
        });

        if (day !== 'All') {
            // Then hide hit boxes
            this.athletePrograms.forEach(item => {
                if (!RegExp(day).test(item.programSchedule)) {
                    // programs.splice(i, 1);
                    $('#' + item.id).hide();
                }
            });

        }
    }

    /**
     * Shows modalWorkOutProgramForm with selected program's data
     * @param data expects json/object value
     */
    populateFormWithData(data: any) {
        // First, make sure data from previous transaction has been cleared first.
        this.clearFormData();
        this.formHeaderLabel = 'Update Workout Program';
        this.formSaveButtonLabel = 'Update';
        this.isformActionCreate = false;
        this.isExerciseForUpdate = false;
        this.workoutProgramId = data.id;
        this.workoutProgramName = data.programName;
        this.workoutProgramScheduleUnit = data.programDurationRaw.unit;
        this.workoutProgramScheduleUnitValue = data.programDurationRaw.value;
        this.constructCorrectSchedule(true, data.programSchedule);
        this.exercises = data.exercises;
        // Then, show the form.
        $('#modalWorkOutProgramForm').modal('show');
    }

    /**
     * Clears form data
     */
    clearFormData() {
        this.mainModel = new Main();
        this.workoutProgramId = '';
        this.workoutProgramName = '';
        this.workoutProgramScheduleUnit = '';
        this.workoutProgramScheduleUnitValue = 0;
        this.workoutProgramSchedule = {
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false,
            Sat: false,
            Sun: false
        };
        this.exerciseName = '';
        this.exerciseDuration = '';
        this.exercises = new Array();
        this.formMsg = '';

        // Update DOM (uncheck all days)
        const days = $('.form-check-input');
        for (let i = 0; i < days.length; i++) {
            days[i].checked = false;
        }
    }

    /**
     * Shows the workout program modal form
     */
    addWorkoutProgram() {
        // First, make sure data from previous transaction has been cleared first.
        this.clearFormData();
        // Set Form header and button labels
        this.formHeaderLabel = 'Let\'s create you a Workout Program';
        this.formSaveButtonLabel = 'Create';
        // Set form action create = true
        this.isformActionCreate = true;
        // Then, show the form.
        $('#modalWorkOutProgramForm').modal('show');
    }

    /**
     * Checks if exercises is already in the program
     */
    checkExerciseIfExists(name: string): boolean {
        let flag = false;
        this.exercises.forEach(item => {
            if (item.name === name) {
                flag = true;
            }
        });
        return flag;
    }

    /**
     * Lisetend to keyboard event, if the user hits enter then function addExerciseToProgram() will be called
     * @param event expects keyboard event
     */
    keyUp(event: any) {
        if (event.keyCode === 13) {
            this.addExerciseToProgram( this.isExerciseForUpdate ? true : false );
            this.isExerciseForUpdate = false;
        }
    }

    /**
     * Add exercise to the workout program
     */
    addExerciseToProgram(isExerciseForUpdate: Boolean = false) {
        const exercise = {
            name: this.exerciseName,
            duration: this.exerciseDuration
        };

        // Remove any indication of error in inputs before checking
        $('#exerciseName').removeClass('border-danger');
        $('#exerciseDuration').removeClass('border-danger');

        if (exercise.name.length > 0 && exercise.duration.length > 0) {
            if (!isExerciseForUpdate) {
                let flag = false;
                if (this.exercises.length > 0) {
                flag = this.checkExerciseIfExists(exercise.name);
                }
                if (!flag) {
                    this.exercises.push(exercise);
                    this.exerciseName = '';
                    this.exerciseDuration = '';
                } else {
                    this.formMsg = 'duplicate exercise';
                    this.toggleErrorMsg();
                }
            } else {
                this.exercises.forEach((item, i)  => {
                    if (exercise.name === item.name) {
                        item.duration = exercise.duration;
                        this.exerciseName = '';
                        this.exerciseDuration = '';
                        $('#exerciseName').attr('disabled', false);
                    }
                });
            }
        } else if (exercise.name.length > 0 && exercise.duration.length === 0) {
            $('#exerciseDuration').addClass('border-danger');
        } else if (exercise.name.length === 0 && exercise.duration.length > 0) {
            $('#exerciseName').addClass('border-danger');
        } else {
            $('#exerciseName').addClass('border-danger');
            $('#exerciseDuration').addClass('border-danger');
        }
    }

    /**
     * Removes exercises from the program
     * @param index expecting a number (reference to exercises array item to be removed);
     */
    removeExerciseFromProgram(index: number) {
        this.exercises.splice(index, 1);
    }

    /**
     * Set's form's exercise name and exercise reps/duration values (values coming from selected items in exercises array)
     * @param index expecting number value
     */
    setExercise(index: number) {
        this.isExerciseForUpdate = true;
        this.exerciseName = this.exercises[index].name;
        this.exerciseDuration = this.exercises[index].duration;
        $('#exerciseName').attr('disabled', true);
    }

    /**
     * Calculates the full duration of the workout program
     */
    calcProgramDuration(): Date {
        const today = new Date();
        switch (this.workoutProgramScheduleUnit) {
            case 'Days':
                today.setDate(today.getDate() + this.workoutProgramScheduleUnitValue);
            break;
            case 'Weeks':
                today.setDate(today.getDate() + (this.workoutProgramScheduleUnitValue * 7));
            break;
            case 'Months':
                today.setMonth(today.getMonth() + this.workoutProgramScheduleUnitValue);
            break;
            default:
                // Do nothing.
            break;
        }
        return today;
    }

    /**
     * Propagates the accurate program schedule based on selected checkboxes
     * @param reconstructForm expects true or false (switch if it's for create or update mode)
     * @param reconstructFormData expects string (this is the days e.g Mon Tue etc, only for update mode)
     */
    constructCorrectSchedule(reconstructForm: Boolean = false, reconstructFormData: string = '') {
        if (!reconstructForm) {
            if ($('.form-check-input')[0].checked) {
                this.workoutProgramSchedule.Mon = true;
            } else {
                this.workoutProgramSchedule.Mon = false;
            }

            if ($('.form-check-input')[1].checked) {
                this.workoutProgramSchedule.Tue = true;
            } else {
                this.workoutProgramSchedule.Tue = false;
            }

            if ($('.form-check-input')[2].checked) {
                this.workoutProgramSchedule.Wed = true;
            } else {
                this.workoutProgramSchedule.Wed = false;
            }

            if ($('.form-check-input')[3].checked) {
                this.workoutProgramSchedule.Thu = true;
            } else {
                this.workoutProgramSchedule.Thu = false;
            }

            if ($('.form-check-input')[4].checked) {
                this.workoutProgramSchedule.Fri = true;
            } else {
                this.workoutProgramSchedule.Fri = false;
            }

            if ($('.form-check-input')[5].checked) {
                this.workoutProgramSchedule.Sat = true;
            } else {
                this.workoutProgramSchedule.Sat = false;
            }

            if ($('.form-check-input')[6].checked) {
                this.workoutProgramSchedule.Sun = true;
            } else {
                this.workoutProgramSchedule.Sun = false;
            }
        } else {
            const schedule = reconstructFormData.split(' ');
            schedule.splice(schedule.length - 1, 1);
            for (let i = 0; i < schedule.length; i++) {
                if (RegExp('Mon').test(schedule[i])) {
                    $('.form-check-input')[0].checked = true;
                }

                if (RegExp('Tue').test(schedule[i])) {
                    $('.form-check-input')[1].checked = true;
                }

                if (RegExp('Wed').test(schedule[i])) {
                    $('.form-check-input')[2].checked = true;
                }

                if (RegExp('Thu').test(schedule[i])) {
                    $('.form-check-input')[3].checked = true;
                }

                if (RegExp('Fri').test(schedule[i])) {
                    $('.form-check-input')[4].checked = true;
                }

                if (RegExp('Sat').test(schedule[i])) {
                    $('.form-check-input')[5].checked = true;
                }

                if (RegExp('Sun').test(schedule[i])) {
                    $('.form-check-input')[6].checked = true;
                }
            }
        }
    }

    /**
     * Check all days
     */
    daily() {
        // 1. Update DOM (check all days)
        const days = $('.form-check-input');
        for (let i = 0; i < days.length; i++) {
            days[i].checked = true;
        }
        // 2. Upate workoutProgramSchedule
        this.workoutProgramSchedule.Mon = true;
        this.workoutProgramSchedule.Tue = true;
        this.workoutProgramSchedule.Wed = true;
        this.workoutProgramSchedule.Thu = true;
        this.workoutProgramSchedule.Fri = true;
        this.workoutProgramSchedule.Sat = true;
        this.workoutProgramSchedule.Sun = true;

    }

    /**
     * Error message handler for out form
     * @param action - determines if we show/hide error msg
     */
    toggleErrorMsg(action: string = 'show') {
        if (action === 'show') {
            if ($('#formError').css('display') === 'none') {
                $('#formError').fadeIn('slow');
            }
        } else {
            $('#formError').fadeOut('slow');
        }
    }

    /**
     * Validates our form if all needed data were entered
     */
    formValidator(): boolean {
        const today = new Date();
        const days = $('.form-check-input');
        let scheduleFlag = false;
        // Check for program name
        if (this.workoutProgramName.replace(/ /g, '') === '') {
            this.formMsg = 'Your workout program needs a name.';
            this.toggleErrorMsg();
            return false;
        }
        // Check for valid program duration
        if (today.toLocaleString() === this.calcProgramDuration().toLocaleString()) {
            this.formMsg = 'Program needs at least 1 day duration.';
            this.toggleErrorMsg();
            return false;
        }
        // Check for program schedule
        for (let i = 0; i < days.length; i++) {
            if (days[i].checked === true) {
                scheduleFlag = true;
            }
        }
        if (!scheduleFlag) {
            this.formMsg = 'Buddy, you need to schedule this workout.';
            this.toggleErrorMsg();
            return false;
        }
        // Check for exercises
        if (this.exercises.length === 0) {
            this.formMsg = 'Buddy, what\'s a program w/o an exercise? :)';
            this.toggleErrorMsg();
            return false;
        }
        return true;

    }

    /**
     * Saves our Buddy workout program ;)
     */
    saveProgram() {
        if (this.formValidator()) {
            // Show progress bar
            $('#loadingSave').fadeIn('slow');

             // Get the correct schedule
            this.constructCorrectSchedule();

            // Now we're ready to form our data
            this.mainModel.id = this.workoutProgramId;
            this.mainModel.athlete = this.athlete;
            this.mainModel.programName = this.workoutProgramName;
            this.mainModel.programDuration = this.calcProgramDuration();
            this.mainModel.programDurationRaw.value = this.workoutProgramScheduleUnitValue;
            this.mainModel.programDurationRaw.unit = this.workoutProgramScheduleUnit;
            this.mainModel.programSchedule = this.workoutProgramSchedule;
            this.mainModel.programExercises = this.exercises;

            if (this.isformActionCreate) {
                this.mainService.saveProgramWorkout(this.mainModel)
                    .subscribe(
                        res => {
                            const response: any = res;
                            this.formMsg = response.msg;
                            $('#formError').addClass('formSuccess');
                            this.toggleErrorMsg();
                            setTimeout(() => {
                                $('#modalWorkOutProgramForm').modal('hide');
                                $('#formError').removeClass('formSuccess');
                                this.getAthleteSavedPrograms();
                            }, 3000);
                        },
                        err => {
                            console.log(err);
                        },
                        () => {
                            $('#loadingSave').fadeOut('fast');
                        }
                    );
            } else {
                this.mainService.updateProgramWorkout(this.mainModel)
                    .subscribe(
                        res => {
                            const response: any = res;
                            this.formMsg = response.msg;
                            $('#formError').addClass('formSuccess');
                            this.toggleErrorMsg();
                            setTimeout(() => {
                                $('#modalWorkOutProgramForm').modal('hide');
                                $('#formError').removeClass('formSuccess');
                                this.getAthleteSavedPrograms();
                            }, 3000);
                        },
                        err => {
                            console.log(err);
                        },
                        () => {
                            $('#loadingSave').fadeOut('fast');
                        }
                    );

            }
        }
    }

    /**
     * Just clear localstorage and redirects back to login page.
     */
    signOut() {
        localStorage.clear();
        this.router.navigate(['login']);
    }

}
