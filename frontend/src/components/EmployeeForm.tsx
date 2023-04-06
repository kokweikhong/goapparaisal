import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IEmployee } from "../variables/employee";
import { ScoreDetailsFormInput } from "./ScoreDetailsFormInput";
import { GenerateAverageScores } from "../../wailsjs/go/main/App";
import { useEmployeeContext } from "../context/employee";

export interface IEmployeeFormProps {
  employee: IEmployee
}


export const EmployeeForm: React.FC<IEmployee> = (employee: IEmployee) => {
  const { data, setData } = useEmployeeContext()
  const { register, handleSubmit, reset } = useForm<IEmployee>({
    defaultValues: {}
  });
  const onSubmit: SubmitHandler<IEmployee> = (formData) => {
    const updateData = data.filtered.map(e => (
      e.employeeCode === formData.employeeCode ? formData : e
    ))
    setData(prev => ({ ...prev, data: { ...prev.data, filtered: updateData } }))
    console.log(data);
  }

  const handleGenerateAverageScores = async () => {
    const employeeAfterAverageScore = await GenerateAverageScores(employee) as unknown as IEmployee
    employee = employeeAfterAverageScore
    reset(employee)
  }

  useEffect(() => {
    reset(employee)
  }, [employee])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-div">
          <label className="form-label">Employee No</label>
          <input {...register("employeeCode")} disabled className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Employee Name</label>
          <input {...register("employeeName")} disabled className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Designation</label>
          <input {...register("designation")} disabled className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Date Join</label>
          <input {...register("dateJoin")} disabled className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Division</label>
          <input {...register("division")} disabled className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Department</label>
          <input {...register("department")} disabled className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Score</label>
          <input {...register("score")} type="number" step={0.1} className="form-input" />
        </div>
        <div className="form-div">
          <label className="form-label">Rating</label>
          <input {...register("rating")} type="number" step={1} className="form-input" />
        </div>
      </div>
      <div className="py-10">
        <div className="my-4 flex gap-4 items-center">
          <h2 className="font-bold uppercase text-xl">Score Details</h2>
          <button onClick={handleGenerateAverageScores}
            className="bg-blue-500 rounded-xl text-[#fff] font-semibold tracking-wider py-2 px-4">Auto Generate Scores and Comments</button>
        </div>
        <ScoreDetailsFormInput
          register={register}
          title="Job Knowledge"
          scoreLabel="jobKnowledge"
          scoreDetails={employee.scoreDetails.jobKnowledge}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Quality Of Work"
          scoreLabel="qualityOfWork"
          scoreDetails={employee.scoreDetails.qualityOfWork}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Quantity Of Work"
          scoreLabel="quantityOfWork"
          scoreDetails={employee.scoreDetails.quantityOfWork}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Teamwork/Co-operation"
          scoreLabel="teamwork"
          scoreDetails={employee.scoreDetails.teamwork}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Dependability/Responsibility"
          scoreLabel="responsibility"
          scoreDetails={employee.scoreDetails.responsibility}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Initiative"
          scoreLabel="initiative"
          scoreDetails={employee.scoreDetails.initiative}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Housekeeping, Safety and Cost Consciousness"
          scoreLabel="safety"
          scoreDetails={employee.scoreDetails.safety}
        />
      </div>
      <input type="submit" />
    </form>
  );
}
