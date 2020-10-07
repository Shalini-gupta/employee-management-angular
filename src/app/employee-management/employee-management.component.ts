import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Api } from '../../api/api.service';
import { ExcelService } from '../../api/excel.service';
import { CommonService } from '../../api/comman.service';

declare var $;
@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employeeForm: FormGroup;
  editEmployeeForm: FormGroup;
  searchForm: FormGroup;
  employes: []
  employeeId: String
  employeeSubmitCheck: Boolean = false
  employeeEditCheck: Boolean = false
  searchCheck: Boolean = false
  excelData: any = []
  constructor(
    private api: Api,
    private fb: FormBuilder,
    private excelService: ExcelService,
    private commonService: CommonService,
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address1: ['', []],
      earnings: ['', []],
      deduction: ['', []],
      totalPay: ['', []],
      qualification: ['', []],
    })
    this.editEmployeeForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      address1: ['', []],
      earnings: ['', []],
      deduction: ['', []],
      totalPay: ['', []],
      qualification: ['', []],
    })
    this.searchForm = this.fb.group({
      fromEmpId: ['', [Validators.required]],
      toEmpId: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.employeeList()
  }

  employeeList() {
    this.api.get("listEmployee").subscribe(result => {
      if (result.status == 200) {
        this.employes = result.data
        this.excelData = []
        result.data.map(value => {
          this.excelData.push({
            'Name': value.name,
            'Address': value.address,
            'Address1': value.address1,
            'Earnings': value.earnings,
            'Deduction': value.deduction,
            'TotalPay': value.totalPay,
            'Qualification': value.qualification,
          })
        })

      } else {
        console.log('Something went wrong')
      }
    }, error => {
      console.log({ error })
    })
  }

  getDetail(employeeId) {
    this.employeeId = employeeId
    this.api.get("getEmployee/" + this.employeeId).subscribe(result => {
      if (result.status == 200) {
        let employee = result.data
        this.editEmployeeForm.patchValue({
          name: employee.name,
          address: employee.address,
          address1: employee.address1,
          earnings: employee.earnings,
          deduction: employee.deduction,
          totalPay: employee.totalPay,
          qualification: employee.qualification,
        })
      } else {
        console.log('Something went wrong')
      }
    }, error => {
      console.log({ error })
    })
  }


  onSubmit() {
    this.employeeSubmitCheck = true
    if (this.employeeForm.invalid) {
      return
    }
    let data = {
      name: this.employeeForm.value.name,
      address: this.employeeForm.value.address,
      address1: this.employeeForm.value.address1,
      earnings: this.employeeForm.value.earnings,
      deduction: this.employeeForm.value.deduction,
      totalPay: this.employeeForm.value.totalPay,
      qualification: this.employeeForm.value.qualification,
    }
    this.api.post("addEmployee", data).subscribe(result => {
      $('#AddModal').modal('hide')
      if (result.status == 200) {
        this.employeeForm.reset()
        this.employeeSubmitCheck = false
        this.employeeList()
        this.commonService.succ(result.message)
      } else if (result.status == 405) {
        this.commonService.succ(result.message)
      } else {
        console.log('Something went wrong')
      }
    }, error => {
      console.log({ error })
    })
  }

  onEditSubmit() {
    this.employeeEditCheck = true
    if (this.editEmployeeForm.invalid) {
      return
    }
    let data = {
      name: this.editEmployeeForm.value.name,
      address: this.editEmployeeForm.value.address,
      address1: this.editEmployeeForm.value.address1,
      earnings: this.editEmployeeForm.value.earnings,
      deduction: this.editEmployeeForm.value.deduction,
      totalPay: this.editEmployeeForm.value.totalPay,
      qualification: this.editEmployeeForm.value.qualification,
      id: this.employeeId,
    }
    this.api.post("updateEmployee", data).subscribe(result => {
      $('#EditModal').modal('hide')
      if (result.status == 200) {
        this.employeeForm.reset()
        this.employeeSubmitCheck = false
        this.employeeList()
        this.commonService.succ(result.message)
      } else if (result.status == 405) {
        this.commonService.succ(result.message)
      } else {
        console.log('Something went wrong')
      }
    }, error => {
      console.log({ error })
    })
  }

  deleteEmp() {
    this.api.get("deleteEmployee/" + this.employeeId).subscribe(result => {
      if (result.status == 200) {
        this.commonService.succ(result.message)
        this.employeeList()
      } else {
        console.log('Something went wrong')
      }
    }, error => {
      console.log({ error })
    })
  }

  exportToCsv() {
    this.excelService.exportAsExcelFile(this.excelData, 'Employes Report');
  }

  calculatePay() {
    let total = this.employeeForm.value.earnings - this.employeeForm.value.deduction
    this.employeeForm.patchValue({
      totalPay: total
    })
  }

  editCalculatePay() {
    let total = this.editEmployeeForm.value.earnings - this.editEmployeeForm.value.deduction
    this.editEmployeeForm.patchValue({
      totalPay: total
    })
  }

  onSearch() {
    this.searchCheck = true
    if (this.searchForm.invalid) {
      return
    }
    let data = {
      fromEmpId: this.searchForm.value.fromEmpId,
      toEmpId: this.searchForm.value.toEmpId,
    }
    this.api.post("searchEmployee", data).subscribe(result => {
      if (result.status == 200) {
        this.employeeForm.reset()
        this.searchCheck = false
        this.employes = result.data
        this.excelData = []
        result.data.map(value => {
          this.excelData.push({
            'Name': value.name,
            'Address': value.address,
            'Address1': value.address1,
            'Earnings': value.earnings,
            'Deduction': value.deduction,
            'TotalPay': value.totalPay,
            'Qualification': value.qualification,
          })
        })
      } else {
        console.log('Something went wrong')
      }
    }, error => {
      console.log({ error })
    })
  }

}
