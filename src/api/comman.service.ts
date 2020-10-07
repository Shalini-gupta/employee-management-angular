import { Injectable } from '@angular/core'
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})

export class CommonService {
    constructor(
        private toastr: ToastrService
    ) { }

    succ(msg) {
        this.toastr.success(msg);
    }
    err(msg) {
        this.toastr.error(msg);
    }
}




