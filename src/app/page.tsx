import BlogList from '@/app/components/BlogList';

export default function Home() {
  return (
    <BlogList
      title="Blog Runit: Desempenho e Tecnologia"
      subtitle="Notícias, dicas e análises sobre corrida, saúde e o mundo da Runit."
      showSidebar={true}
    />
  );
}
