import React, { useState, useMemo } from 'react';
import { useEnterprise } from '../../context/EnterpriseContext';
import { Employee, AttendanceRecord, SalarySlip, EmployeeDepartment } from '../../types';
import { formatIndianCurrency } from '../../data/sampleData';
import { calculateSalary } from '../../utils/manufacturingCalculations';
import { exportToExcel, printDocument } from '../../utils/exportUtils';
import {
  Users,
  UserCheck,
  CalendarCheck,
  Banknote,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  FileSpreadsheet,
  X,
  Phone,
  Building,
  Briefcase,
  FileText,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const {
    employees,
    attendance,
    salarySlips,
    addEmployee,
    updateEmployee,
    markAttendance,
    bulkMarkAttendance,
    generateSalarySlip,
    markSalaryPaid,
  } = useEnterprise();

  const [activeTab, setActiveTab] = useState<'directory' | 'attendance' | 'salary'>('directory');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('11/11/2026');

  // Modals
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isGenerateSlipOpen, setIsGenerateSlipOpen] = useState(false);
  const [printableSlip, setPrintableSlip] = useState<SalarySlip | null>(null);

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    phone: '',
    address: '',
    designation: '',
    department: 'Production' as EmployeeDepartment,
    joiningDate: '11/11/2026',
    employmentType: 'Full-Time' as Employee['employmentType'],
    salaryType: 'Monthly' as Employee['salaryType'],
    monthlySalary: 30000,
    dailyWage: 0,
    pieceRatePerBag: 0,
    emergencyContact: '',
    status: 'Active' as Employee['status'],
  });

  const [slipForm, setSlipForm] = useState({
    employeeId: employees[0]?.id || '',
    month: 'November',
    year: 2026,
    daysPresent: 26,
    daysAbsent: 4,
    overtimeHours: 10,
    bagsHandled: 0,
    advances: 0,
    pfEsi: 1800,
    bonuses: 1000,
  });

  // Selected Employee for Slip
  const selectedSlipEmployee = useMemo(() => {
    return employees.find(e => e.id === slipForm.employeeId) || employees[0];
  }, [employees, slipForm.employeeId]);

  // Dynamic salary preview for slip form
  const salaryCalcPreview = useMemo(() => {
    if (!selectedSlipEmployee) return null;
    return calculateSalary({
      basicSalary: selectedSlipEmployee.salaryType === 'Monthly' ? selectedSlipEmployee.monthlySalary : 0,
      dailyWage: selectedSlipEmployee.dailyWage,
      pieceRatePerBag: selectedSlipEmployee.pieceRatePerBag || 4.5,
      daysPresent: slipForm.daysPresent,
      daysAbsent: slipForm.daysAbsent,
      overtimeHours: slipForm.overtimeHours,
      overtimeHourlyRate: 80,
      bagsHandled: slipForm.bagsHandled,
      advances: slipForm.advances,
      pfEsi: slipForm.pfEsi,
      bonuses: slipForm.bonuses,
    });
  }, [selectedSlipEmployee, slipForm]);

  // Metrics
  const metrics = useMemo(() => {
    const totalStaff = employees.length;
    const todayRecords = attendance.filter(a => a.date === selectedDate);
    const presentToday = todayRecords.filter(a => a.status === 'Present').length;
    const monthlyPayroll = employees.reduce((acc, e) => acc + (e.monthlySalary || e.dailyWage * 26), 0);
    const pieceRateWorkers = employees.filter(e => e.employmentType === 'Piece Rate').length;

    return {
      totalStaff,
      presentToday,
      attendanceRate: totalStaff > 0 ? Math.round((presentToday / totalStaff) * 100) : 0,
      monthlyPayroll,
      pieceRateWorkers,
    };
  }, [employees, attendance, selectedDate]);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      if (departmentFilter !== 'all' && e.department !== departmentFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          e.name.toLowerCase().includes(term) ||
          e.employeeId.toLowerCase().includes(term) ||
          e.designation.toLowerCase().includes(term) ||
          e.phone.includes(term)
        );
      }
      return true;
    });
  }, [employees, departmentFilter, searchTerm]);

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name.trim()) return;

    addEmployee({
      name: employeeForm.name,
      phone: employeeForm.phone,
      address: employeeForm.address,
      designation: employeeForm.designation,
      department: employeeForm.department,
      joiningDate: employeeForm.joiningDate,
      employmentType: employeeForm.employmentType,
      salaryType: employeeForm.salaryType,
      monthlySalary: Number(employeeForm.monthlySalary),
      dailyWage: Number(employeeForm.dailyWage),
      pieceRatePerBag: Number(employeeForm.pieceRatePerBag),
      emergencyContact: employeeForm.emergencyContact,
      status: employeeForm.status,
    });

    setIsAddEmployeeOpen(false);
  };

  const handleSaveSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlipEmployee || !salaryCalcPreview) return;

    const created = generateSalarySlip({
      month: slipForm.month,
      year: slipForm.year,
      employeeId: selectedSlipEmployee.id,
      employeeName: selectedSlipEmployee.name,
      department: selectedSlipEmployee.department,
      designation: selectedSlipEmployee.designation,
      daysPresent: slipForm.daysPresent,
      daysAbsent: slipForm.daysAbsent,
      overtimeHours: slipForm.overtimeHours,
      bagsHandled: slipForm.bagsHandled,
      basicSalary: selectedSlipEmployee.salaryType === 'Monthly' ? selectedSlipEmployee.monthlySalary : salaryCalcPreview.wageBase,
      overtimePay: salaryCalcPreview.overtimePay,
      pieceRatePay: salaryCalcPreview.pieceRatePay,
      bonuses: salaryCalcPreview.bonuses,
      grossEarnings: salaryCalcPreview.grossEarnings,
      advanceDeductions: slipForm.advances,
      pfEsiDeductions: slipForm.pfEsi,
      totalDeductions: salaryCalcPreview.totalDeductions,
      netPayable: salaryCalcPreview.netPayable,
      paymentStatus: 'Pending',
    });

    setIsGenerateSlipOpen(false);
    setPrintableSlip(created);
  };

  const handleExportStaffExcel = () => {
    const cols = [
      { header: 'Emp ID', key: 'employeeId' },
      { header: 'Name', key: 'name' },
      { header: 'Designation', key: 'designation' },
      { header: 'Department', key: 'department' },
      { header: 'Employment Type', key: 'employmentType' },
      { header: 'Salary / Wage', key: 'monthlySalary' },
      { header: 'Phone', key: 'phone' },
      { header: 'Status', key: 'status' },
    ];
    exportToExcel(cols, filteredEmployees, `Employee_Directory_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Employee, Staff & Factory Labour Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Goyal Cattle Feed Pvt. Ltd. | Shift Muster Roll, Biometric Attendance, Contract Bag Loading & Salary Register
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportStaffExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Staff
          </button>

          <button
            onClick={() => printDocument()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Muster
          </button>

          <button
            onClick={() => setIsGenerateSlipOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            Generate Salary Slip
          </button>

          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Workforce</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalStaff} <span className="text-xs font-normal text-slate-400">Personnel</span>
          </div>
          <span className="text-[10px] text-slate-400">Across 7 departments</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Today's Attendance</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {metrics.presentToday} / {metrics.totalStaff}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">{metrics.attendanceRate}% Present today</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Monthly Payroll Liability</span>
            <Banknote className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {formatIndianCurrency(metrics.monthlyPayroll)}
          </div>
          <span className="text-[10px] text-slate-400">Salaries & base wages</span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Contract Loading Labour</span>
            <Briefcase className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 font-mono">
            {metrics.pieceRateWorkers} <span className="text-xs font-normal text-slate-400">Teams</span>
          </div>
          <span className="text-[10px] text-amber-500 font-medium">Piece-rate ₹4.50 / bag loaded</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'directory'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Employee & Staff Directory ({employees.length})
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          Daily Attendance Register
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'salary'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Banknote className="w-4 h-4" />
          Salary & Wage Slips ({salarySlips.length})
        </button>
      </div>

      {/* TAB 1: Employee Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Department:</span>
              {['all', 'Production', 'Warehouse', 'Transport', 'Accounts', 'Administration', 'Maintenance'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setDepartmentFilter(dept)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                    departmentFilter === dept
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {dept === 'all' ? 'All' : dept}
                </button>
              ))}
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search staff by name, ID..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department & Role</th>
                  <th className="p-3">Contact & Phone</th>
                  <th className="p-3">Employment Type</th>
                  <th className="p-3 text-right">Wage / Salary</th>
                  <th className="p-3">Bank Details</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{emp.name}</div>
                      <span className="text-[11px] font-mono text-slate-400">{emp.employeeId} · Joined {emp.joiningDate}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{emp.designation}</div>
                      <span className="text-[11px] text-slate-500">{emp.department}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-mono text-slate-900 dark:text-white">{emp.phone}</div>
                      <span className="text-[10px] text-slate-400 truncate block max-w-xs">{emp.address}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {emp.employmentType} ({emp.salaryType})
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {emp.salaryType === 'Monthly'
                        ? formatIndianCurrency(emp.monthlySalary) + ' / Mo'
                        : emp.salaryType === 'Piece Rate'
                        ? `₹${emp.pieceRatePerBag} / Bag`
                        : `₹${emp.dailyWage} / Day`}
                    </td>
                    <td className="p-3 text-[11px] text-slate-500 font-mono">
                      {emp.bankAccount ? (
                        <>
                          <div>{emp.bankAccount.bankName}</div>
                          <div>A/C: {emp.bankAccount.accountNumber}</div>
                        </>
                      ) : (
                        <span className="text-slate-400">Cash Disbursal</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Attendance Register */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Selected Date:</span>
              <input
                type="text"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => bulkMarkAttendance(selectedDate, 'Present')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Mark All Present
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Punch Times</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Overtime / Bags</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {employees.map(emp => {
                  const record = attendance.find(a => a.employeeId === emp.id && a.date === selectedDate);
                  const isPresent = record?.status === 'Present';

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        {emp.name}
                        <span className="text-[10px] text-slate-400 block font-normal">{emp.employeeId}</span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{emp.department}</td>
                      <td className="p-3 font-mono text-slate-500">
                        {record?.checkIn ? `${record.checkIn} - ${record.checkOut || 'Active'}` : '-'}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record?.status || 'Not Marked'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold">
                        {record?.bagsLoaded ? `${record.bagsLoaded} Bags` : record?.overtimeHours ? `+${record.overtimeHours}h OT` : '-'}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{record?.notes || '-'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() =>
                            markAttendance({
                              date: selectedDate,
                              employeeId: emp.id,
                              employeeName: emp.name,
                              department: emp.department,
                              status: isPresent ? 'Absent' : 'Present',
                              checkIn: !isPresent ? '08:00 AM' : undefined,
                              checkOut: !isPresent ? '05:30 PM' : undefined,
                            })
                          }
                          className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                            isPresent ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          Toggle {isPresent ? 'Absent' : 'Present'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Salary Register & Wage Slips */}
      {activeTab === 'salary' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b">
                <tr>
                  <th className="p-3">Salary Slip No.</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-right">Days Present</th>
                  <th className="p-3 text-right">Gross Earnings</th>
                  <th className="p-3 text-right">Deductions</th>
                  <th className="p-3 text-right">Net Payable</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {salarySlips.map(slp => (
                  <tr key={slp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{slp.slipNumber}</td>
                    <td className="p-3 font-semibold">{slp.month} {slp.year}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{slp.employeeName}</td>
                    <td className="p-3 text-slate-500">{slp.department}</td>
                    <td className="p-3 text-right font-mono">{slp.daysPresent} Days</td>
                    <td className="p-3 text-right font-mono font-semibold">{formatIndianCurrency(slp.grossEarnings)}</td>
                    <td className="p-3 text-right font-mono text-red-600">-{formatIndianCurrency(slp.totalDeductions)}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600 text-sm">
                      {formatIndianCurrency(slp.netPayable)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        slp.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {slp.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setPrintableSlip(slp)}
                        className="px-2.5 py-1 text-[11px] font-semibold border rounded hover:bg-slate-100 inline-flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Add New Employee */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Register New Employee / Factory Labour
              </h3>
              <button onClick={() => setIsAddEmployeeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={employeeForm.name}
                    onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={employeeForm.phone}
                    onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Department *
                  </label>
                  <select
                    value={employeeForm.department}
                    onChange={e => setEmployeeForm({ ...employeeForm, department: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Production">Production</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Transport">Transport</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Administration">Administration</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Designation / Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pellet Mill Operator"
                    value={employeeForm.designation}
                    onChange={e => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Salary Type
                  </label>
                  <select
                    value={employeeForm.salaryType}
                    onChange={e => setEmployeeForm({ ...employeeForm, salaryType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Monthly">Monthly Fixed</option>
                    <option value="Daily">Daily Wage</option>
                    <option value="Piece Rate">Piece-Rate (Per Bag)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Rate / Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={employeeForm.salaryType === 'Monthly' ? employeeForm.monthlySalary : employeeForm.salaryType === 'Piece Rate' ? employeeForm.pieceRatePerBag : employeeForm.dailyWage}
                    onChange={e => {
                      const v = Number(e.target.value);
                      if (employeeForm.salaryType === 'Monthly') setEmployeeForm({ ...employeeForm, monthlySalary: v });
                      else if (employeeForm.salaryType === 'Piece Rate') setEmployeeForm({ ...employeeForm, pieceRatePerBag: v });
                      else setEmployeeForm({ ...employeeForm, dailyWage: v });
                    }}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Employment Mode
                  </label>
                  <select
                    value={employeeForm.employmentType}
                    onChange={e => setEmployeeForm({ ...employeeForm, employmentType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Piece Rate">Piece Rate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  value={employeeForm.address}
                  onChange={e => setEmployeeForm({ ...employeeForm, address: e.target.value })}
                  placeholder="Village / Town, District, Punjab..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 2: Generate Salary Slip */}
      {isGenerateSlipOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                Generate Monthly Salary & Wage Slip
              </h3>
              <button onClick={() => setIsGenerateSlipOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Employee *
                  </label>
                  <select
                    value={slipForm.employeeId}
                    onChange={e => setSlipForm({ ...slipForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Pay Period Month & Year
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slipForm.month}
                      onChange={e => setSlipForm({ ...slipForm, month: e.target.value })}
                      className="w-2/3 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                    />
                    <input
                      type="number"
                      value={slipForm.year}
                      onChange={e => setSlipForm({ ...slipForm, year: Number(e.target.value) })}
                      className="w-1/3 px-2 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Days Present</label>
                  <input
                    type="number"
                    value={slipForm.daysPresent}
                    onChange={e => setSlipForm({ ...slipForm, daysPresent: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Overtime Hours</label>
                  <input
                    type="number"
                    value={slipForm.overtimeHours}
                    onChange={e => setSlipForm({ ...slipForm, overtimeHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Bags Handled (Piece)</label>
                  <input
                    type="number"
                    value={slipForm.bagsHandled}
                    onChange={e => setSlipForm({ ...slipForm, bagsHandled: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Festive Bonus (₹)</label>
                  <input
                    type="number"
                    value={slipForm.bonuses}
                    onChange={e => setSlipForm({ ...slipForm, bonuses: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Advance Deductions (₹)</label>
                  <input
                    type="number"
                    value={slipForm.advances}
                    onChange={e => setSlipForm({ ...slipForm, advances: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 text-red-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">PF / ESI Deductions (₹)</label>
                  <input
                    type="number"
                    value={slipForm.pfEsi}
                    onChange={e => setSlipForm({ ...slipForm, pfEsi: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 text-red-600"
                  />
                </div>
              </div>

              {/* Calculated Net Preview */}
              {salaryCalcPreview && (
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Calculated Net Payable</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {formatIndianCurrency(salaryCalcPreview.netPayable)}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>Gross: ₹{salaryCalcPreview.grossEarnings.toLocaleString('en-IN')}</div>
                    <div>Deductions: -₹{salaryCalcPreview.totalDeductions.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateSlipOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  Generate & View Slip
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal 3: Printable Salary Slip */}
      {printableSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Voucher Slip</span>
              <button onClick={() => setPrintableSlip(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slip Paper */}
            <div className="p-5 border-2 border-slate-900 rounded-xl space-y-3 bg-white text-slate-900 text-xs">
              <div className="text-center border-b pb-3">
                <h3 className="font-black text-sm uppercase text-emerald-800">GOYAL CATTLE FEED PVT. LTD.</h3>
                <p className="text-[10px] text-slate-500">Khanna Main Feed Plant, GT Road, Punjab | Wages & Payroll Voucher</p>
                <div className="mt-1 font-bold text-xs">SALARY SLIP FOR {printableSlip.month.toUpperCase()} {printableSlip.year}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>Employee: <strong>{printableSlip.employeeName}</strong></div>
                <div>Slip No: <strong className="font-mono">{printableSlip.slipNumber}</strong></div>
                <div>Department: {printableSlip.department}</div>
                <div>Designation: {printableSlip.designation}</div>
                <div>Days Present: <strong>{printableSlip.daysPresent} Days</strong></div>
                <div>Status: <strong className="text-emerald-700">{printableSlip.paymentStatus}</strong></div>
              </div>

              <div className="border rounded-lg overflow-hidden text-xs">
                <div className="grid grid-cols-2 bg-slate-100 font-bold p-2 border-b">
                  <span>Earnings Breakdown</span>
                  <span className="text-right">Deductions</span>
                </div>
                <div className="grid grid-cols-2 p-2.5 text-[11px] gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Basic Wages:</span><strong>₹{printableSlip.basicSalary}</strong></div>
                    {printableSlip.overtimePay > 0 && <div className="flex justify-between"><span>Overtime Pay:</span><strong>₹{printableSlip.overtimePay}</strong></div>}
                    {printableSlip.pieceRatePay > 0 && <div className="flex justify-between"><span>Piece Rate Pay:</span><strong>₹{printableSlip.pieceRatePay}</strong></div>}
                    {printableSlip.bonuses > 0 && <div className="flex justify-between"><span>Allowance:</span><strong>₹{printableSlip.bonuses}</strong></div>}
                    <div className="flex justify-between border-t pt-1 font-bold"><span>Gross:</span><span>₹{printableSlip.grossEarnings}</span></div>
                  </div>
                  <div className="space-y-1 border-l pl-2">
                    <div className="flex justify-between"><span>Advances:</span><strong>₹{printableSlip.advanceDeductions}</strong></div>
                    <div className="flex justify-between"><span>PF / ESI:</span><strong>₹{printableSlip.pfEsiDeductions}</strong></div>
                    <div className="flex justify-between border-t pt-1 font-bold text-red-600"><span>Total Ded.:</span><span>-₹{printableSlip.totalDeductions}</span></div>
                  </div>
                </div>
                <div className="bg-slate-50 border-t p-2.5 flex items-center justify-between font-bold text-sm">
                  <span>NET SALARY PAYABLE:</span>
                  <span className="font-mono text-emerald-700">₹{printableSlip.netPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 text-center text-[10px]">
                <div className="border-t border-dashed pt-1">Accounts Officer / Cashier</div>
                <div className="border-t border-dashed pt-1">Employee Signature / Revenue Stamp</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => printDocument()}
                className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Salary Voucher
              </button>
              <button
                onClick={() => setPrintableSlip(null)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
