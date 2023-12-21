import { Tag } from "@/types/BlogTypes"
type Props = {
    tags: Array<Tag>
}

const BlogTagOverview: React.FC<Props> = ({ tags }: Props) => {
    
    return (
        <>

            {tags && (
                <div>
                    {tags &&
                    tags.map((tags, index) => (
                        <span className="tag" key={index}>
                            {tags.name}
                        </span>
                    ))}
                </div>
            )}
        
        </>
    )
}

export default BlogTagOverview;