const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  )
};

const Content = (props) => {
  return props.parts.map(
    (part) => <Part key={part.id} name={part.name} exercises={part.exercises} />
  );
};

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <p><b>total of {total} exercises</b></p>
  );
};

const Course = (props) => {
  const { course } = props;
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;