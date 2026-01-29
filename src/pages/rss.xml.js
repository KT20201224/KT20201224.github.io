import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_AUTHOR } from '../lib/constants';
import { getPublishedPosts } from '../lib/utils';

export async function GET(context) {
	const allPosts = await getCollection('blog');
	const posts = getPublishedPosts(allPosts);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		language: 'ko',
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description || '',
			link: `/blog/${post.id}/`,
			categories: post.data.tags || [],
			author: SITE_AUTHOR,
		})),
		customData: `<language>ko</language>`,
	});
}
