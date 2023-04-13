export namespace backend {
	
	export class ScoreDetail {
	    overall: number;
	    scores: number[];
	    comment: string;
	
	    static createFrom(source: any = {}) {
	        return new ScoreDetail(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.overall = source["overall"];
	        this.scores = source["scores"];
	        this.comment = source["comment"];
	    }
	}
	export class Employee {
	    employeeCode: string;
	    employeeName: string;
	    designation: string;
	    dateJoin: string;
	    division: string;
	    department: string;
	    supervisor: string;
	    periodUnderReview: string;
	    score: number;
	    rating: number;
	    scoreDetails: {[key: string]: ScoreDetail};
	    performanceSummary: {[key: string]: string};
	    trainingComment: string;
	
	    static createFrom(source: any = {}) {
	        return new Employee(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.employeeCode = source["employeeCode"];
	        this.employeeName = source["employeeName"];
	        this.designation = source["designation"];
	        this.dateJoin = source["dateJoin"];
	        this.division = source["division"];
	        this.department = source["department"];
	        this.supervisor = source["supervisor"];
	        this.periodUnderReview = source["periodUnderReview"];
	        this.score = source["score"];
	        this.rating = source["rating"];
	        this.scoreDetails = source["scoreDetails"];
	        this.performanceSummary = source["performanceSummary"];
	        this.trainingComment = source["trainingComment"];
	    }
	}

}

