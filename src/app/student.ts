export class Student{
    
    constructor(
       public id: number,
        public fname: string,
        public email: string,
        public birthDate: Date,
        public gender: string,        
        public country: string,
        public comments: string,
        public hobbies?: string[]

    ){}
}