import { BehaviorSubject, Observable, of } from "rxjs";
import { MemoizedSelector } from "@ngrx/store";

export class MockStore<T> {
    private _state: T;
    private _stateSubject: BehaviorSubject<T>;
    private _selectorMappings: Array<{subject: BehaviorSubject<any>, selector: MemoizedSelector<T, any>}> = [];

    constructor(initialState: T = undefined) {
        this._state = Object.assign({}, initialState);
        this._stateSubject = new BehaviorSubject(initialState);
    }

    setState(newState: T) {
        this._state = Object.assign({}, newState);
        this._stateSubject.next(this._state);
        this._selectorMappings.map((value) => {
            value.subject.next(value.selector.projector(this._state))
        })
    }

    dispatch(action: any) {

    }

    select(selector: MemoizedSelector<T, any>): Observable<T> {
        const subject =  new BehaviorSubject(selector.projector(this._state));
        this._selectorMappings.push({ subject: subject, selector: selector})
        return subject;
    }
}
