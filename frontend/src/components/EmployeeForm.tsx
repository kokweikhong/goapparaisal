import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { IEmployee } from "../variables/employee";
import { ScoreDetailsFormInput } from "./ScoreDetailsFormInput";
import { GenerateAverageScores } from "../../wailsjs/go/main/App";

export interface IEmployeeFormProps {
  selected: IEmployee
  setSelected: Dispatch<SetStateAction<IEmployee>>
  data: IEmployee[]
  setData: Dispatch<SetStateAction<IEmployee[]>>
}


export const EmployeeForm: React.FC<IEmployeeFormProps> = ({ selected, setSelected, data, setData }) => {
  console.log(selected)
  const { register, handleSubmit, reset } = useForm<IEmployee>({
    defaultValues: {}
  });
  const onSubmit: SubmitHandler<IEmployee> = (formData) => {
    const updateData = data.map(e => (
      e.employeeCode === formData.employeeCode ? formData : e
    ))
    alert(selected.employeeName + " data saved!")
    setData(updateData)
  }

  const handleGenerateAverageScores = async () => {
    const employeeAfterAverageScore = await GenerateAverageScores(selected) as unknown as IEmployee
    setSelected(employeeAfterAverageScore)
    reset(employeeAfterAverageScore)
  }

  useEffect(() => {
    reset(selected)
  }, [selected])

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
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
          scoreDetails={selected?.scoreDetails.jobKnowledge}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Quality Of Work"
          scoreLabel="qualityOfWork"
          scoreDetails={selected?.scoreDetails.qualityOfWork}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Quantity Of Work"
          scoreLabel="quantityOfWork"
          scoreDetails={selected?.scoreDetails.quantityOfWork}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Teamwork/Co-operation"
          scoreLabel="teamwork"
          scoreDetails={selected?.scoreDetails.teamwork}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Dependability/Responsibility"
          scoreLabel="responsibility"
          scoreDetails={selected?.scoreDetails.responsibility}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Initiative"
          scoreLabel="initiative"
          scoreDetails={selected?.scoreDetails.initiative}
        />
        <ScoreDetailsFormInput
          register={register}
          title="Housekeeping, Safety and Cost Consciousness"
          scoreLabel="safety"
          scoreDetails={selected?.scoreDetails.safety}
        />
      </div>


      <div className="p-4">
        <h2 className="text-[18px] font-semibold mb-8">Performance Summary</h2>
        <div className="form-div mt-4">
          <label className="form-label text-black text-[14px] font-medium">Strengths of the employee</label>
          <textarea {...register("performanceSummary.strengthsOfEmployee")} rows={5} className="form-input" />
        </div>
        <div className="form-div mt-4">
          <label className="form-label text-black text-[14px] font-medium">Weaknesses of the employee</label>
          <textarea {...register("performanceSummary.weaknessOfEmployee")} rows={5} className="form-input" />
        </div>
        <div className="form-div mt-4">
          <label className="form-label text-black text-[14px] font-medium">Recommendations for improvement of performance and personal (job related) skills</label>
          <textarea {...register("performanceSummary.improvementNeeds")} rows={5} className="form-input" />
        </div>
        <div className="form-div mt-4">
          <label className="form-label text-black text-[14px] font-medium">What action plans regarding future work improvements, career development, etc have been discussed in the appraisal interview?</label>
          <textarea {...register("performanceSummary.actionPlan")} rows={5} className="form-input" />
        </div>
      </div>


      <div className="p-4 mt-10">
        <h2 className="text-[18px] font-semibold mb-8">Training</h2>
        <div className="form-div mt-4">
          <label className="form-label text-black text-[14px] font-medium">List any formal training employee has attended in the past one year and any training planned for the next one year.</label>
          <textarea {...register("trainingComment")} rows={5} className="form-input" />
        </div>
      </div>

      <div className="flex justify-end p-4">
        <button type="submit"
          className="bg-blue-500 rounded-xl text-[#fff] px-4 py-2 cursor-pointer hover:bg-pink-500">
          Submit
        </button>
      </div>
    </form>
  );
}
