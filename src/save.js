/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({attributes}) {
	return (
		<div { ...useBlockProps.save() }>
			{
				0<attributes.image.length && <div style={{position:'relative'}}> <img className='pic-tag-img' style={{height:`${attributes.imgHt}px`,width:`${attributes.imgWd}px`}} src={attributes.image}/> 
				{

				 0 < attributes.tags.length && attributes.tags.map((tag,i)=> <div className='pic-tag-tags' style={{display:'none',height:`${tag.height*0.95 }px`, width:`${tag.width*0.95 }px`, left:`${tag.x}px`, top:`${tag.y}px`, zIndex:`10000+${i}`,position:'absolute',border:'1px dashed rgba(255,255,255,1)'}}>  
				 <span style={{textAlign:"center", fontFamily :'auto', fontSize:"10px", color:"rgba(255,255,255,1)", backgroundColor:"rgba(0,0,0,1)"}} >
					{tag.class}
				 </span>
				   </div> )	

				}
				</div> 
			}
		</div>
	);
}
