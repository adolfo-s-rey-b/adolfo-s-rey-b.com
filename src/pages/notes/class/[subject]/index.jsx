import SubjectView from '../../../../views/SubjectView';
import { subjectPaths, subjectProps } from '../../../../lib/props/notes';

export default SubjectView;

export async function getStaticPaths() {
  return { paths: subjectPaths(), fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: subjectProps('en', params) };
}
