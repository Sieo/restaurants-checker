import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { PopupComponent } from "../components/popup/popup";

@Injectable({
  providedIn: "root",
})
export class PopupService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private componentRef: ComponentRef<PopupComponent> | null = null;

  open(title: string, message: string): Observable<boolean> {
    const subject = new Subject<boolean>();

    this.componentRef = createComponent(PopupComponent, {
      environmentInjector: this.injector,
    });

    // Set inputs using setInput for signals
    this.componentRef.setInput("title", title);
    this.componentRef.setInput("message", message);

    this.componentRef.instance.result.subscribe((result: boolean) => {
      subject.next(result);
      subject.complete();
      this.close();
    });

    // Attach to the app
    this.appRef.attachView(this.componentRef.hostView);

    // Append to body
    document.body.appendChild(this.componentRef.location.nativeElement);

    return subject.asObservable();
  }

  private close() {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
