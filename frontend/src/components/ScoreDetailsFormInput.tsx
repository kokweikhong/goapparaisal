import { Path, UseFormRegister } from "react-hook-form";
import { IEmployee, IScoreDetails } from "../variables/employee";

type InputProps = {
  title: string
  scoreLabel: string
  scoreDetails: IScoreDetails
  register: UseFormRegister<any>;
};

// The following component is an example of your existing Input Component
export const ScoreDetailsFormInput = ({ title, scoreLabel, scoreDetails, register }: InputProps) => (
  <div className="border border-black border-dotted p-6">
    <h4 className="mb-8 font-bold">{title}</h4>
    <div className="grid grid-cols-6 gap-4 mt-4">
      <div className="form-div">
        <label className="form-label font-semibold text-black">Overall</label>
        <input {...register(`scoreDetails.${scoreLabel}.overall`, { valueAsNumber: true })} type="number" step={0.1} className="form-input" />
      </div>
      {scoreDetails?.scores?.map((score, index) => {
        return (
          <div className="form-div">
            <label className="form-label">{`1.${index + 1}`}</label>
            <input {...register(`scoreDetails.${scoreLabel}.scores.${index}`, { valueAsNumber: true })} type="number" step={0.1} className="form-input" />
          </div>
        )
      })}
    </div>
    <div className="form-div mt-4">
      <label className="form-label">Comment</label>
      <textarea {...register(`scoreDetails.${scoreLabel}.comment`)} rows={5} className="form-input" />
    </div>
  </div>
);
