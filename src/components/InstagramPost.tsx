"use client"; 

import { InstagramEmbed } from 'react-social-media-embed';

export function InstagramPost({url}: {url: string}) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<InstagramEmbed url={url} lang='ro_RO' />
		</div>
	);
}