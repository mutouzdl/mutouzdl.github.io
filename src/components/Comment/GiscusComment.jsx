import Giscus from '@giscus/react'

function GiscusComment() {
    return (
        <Giscus
            repo="mutouzdl/benmutoublog-comments"
            repoId="R_kgDORs5u7Q"
            category="Announcements"
            categoryId="DIC_kwDORs5u7c4C48nO"
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="preferred_color_scheme"
            lang="zh-CN"
            loading="lazy"
        />
    )
}

export default GiscusComment
