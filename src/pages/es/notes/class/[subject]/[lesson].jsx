import LessonView from '../../../../../views/LessonView';
import { lessonPaths, lessonProps } from '../../../../../lib/props/notes';

export default LessonView;

export async function getStaticPaths() {
  return { paths: lessonPaths(), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: await lessonProps('es', params) };
}
