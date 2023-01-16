import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class LicenseInterceptor implements HttpInterceptor {

   constructor(
     protected router: Router,
     protected cookieService: CookieService
   ) {}

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const cloned = req.clone({ withCredentials: true });
      return next.handle(cloned)
        .pipe(map((event: any) => {
          const cookieExists: boolean = this.cookieService.check('X-Licensed');
          if (!cookieExists) {
            console.error("Invalid license!");
            console.error("Navigating to error page!");
            this.router.navigate(["invalid-license"]).then();
          }
          return event;
        }));
   }
}

