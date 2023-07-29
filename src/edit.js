
import { useEffect,useRef} from "react";
import { PanelBody, Button,RangeControl } from '@wordpress/components';
import {load, YOLO_V5_N_COCO_MODEL_CONFIG} from 'yolov5js'

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps,MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes,setAttributes}) {

	const imgRef = useRef();
	const tagRef = useRef(false);

	const detectObj = async ( imgEl,setAttributes,score )=>{

		const model = await load(YOLO_V5_N_COCO_MODEL_CONFIG)
		const detections = await model.detect(imgEl);
		let confObj = detections.filter(x=> x.score >= (parseInt(score)/100))
		setAttributes({tags:confObj})

	}

	useEffect( ()=>{

	
		if(0 < attributes.image.length){
			setAttributes({imgWd:imgRef.current.offsetWidth});
		setAttributes({imgHt:imgRef.current.offsetHeight});
		}


       if(tagRef.current){
		Array.from(imgRef.current.parentElement.querySelectorAll('.pic-tag-box')).map(x=>x.remove());
		     detectObj(imgRef.current,setAttributes,attributes.score);
	   }
	},[attributes.smartTag,attributes.score]);

	useEffect(()=>{


		
		if( 0<attributes.tags.length){


			Array.from(imgRef.current.parentElement.querySelectorAll('.pic-tag-box')).map(x=>x.remove());
			let  parEl =  imgRef.current.parentElement;
		
			attributes.tags.map((tag,i)=>{

				let tagBox =  document.createElement('div');
				tagBox.classList.add('pic-tag-box'); 
				tagBox.setAttribute('data-num',i);
				tagBox.style = `display:none;height:${tag.height*0.95 }px; width:${tag.width*0.95 }px;left:${tag.x}px; top:${tag.y}px;z-index:10000;position:absolute;border:1px dashed rgba(255,255,255,1);`;

				tagBox.addEventListener('mouseover',(e)=>e.target.style.display = '');
				let tagInfoBox =  document.createElement('span');
				tagInfoBox.style = `font-family:auto;text-align:center;margin-top:5px;font-size:10px;color:rgba(255,255,255,1);float:left;background-color:rgba(0,0,0,1);`;
				tagInfoBox.textContent = `${tag.class}`;
				
				tagBox.addEventListener("dblclick",e=>{

					let tagCont =  e.target;
					let parEl = tagCont.parentElement;
					let tagInput = parEl.querySelector('input');
					
					if( undefined != tagInput){
						tagInput.remove();
					} 
					let tagName = document.createElement('input');
					tagName.setAttribute('placeholder',__('Tag name','pic-tag'));
					tagName.addEventListener('change',e=>{

						attributes.tags[parEl.getAttribute('data-num')].class = e.target.value;
						tagCont.textContent = e.target.value;
					});
					tagName.addEventListener('blur',e=>e.target.remove());
					parEl.appendChild(tagName);
					tagName.focus();
				})
				tagBox.appendChild(tagInfoBox)
				parEl.appendChild(tagBox);
				}
			)

			imgRef.current.addEventListener('mouseover',e =>{
				Array.from(e.target.parentElement.querySelectorAll('.pic-tag-box')).map(x=>x.style.display = '');
				})	
		
				imgRef.current.addEventListener('mouseout',e =>{

					Array.from(e.target.parentElement.querySelectorAll('.pic-tag-box')).map(x=>x.style.display = 'none');
		
				})	
				
		
		}
	},[attributes.tags])

	return (
		<div { ...useBlockProps() }>

		{
			0< attributes.image.length && <div style={{position:'relative'}} > <img style={{}} ref={imgRef}  src={attributes.image}/> </div>
		}


<div style={{ padding: '10px', width: 'auto', border:'1px solid #21759b', backgroundColor: 'rgba(255,255,255,1)' }}>
		
<PanelBody>
	<span style={{display:'inline-block', width:'20%'}}><Button style={{ border: '1px solid rgba(0,0,0,1)', float:"left", margin:"10px" }}  onClick={()=>{
	setAttributes({smartTag:true})
	tagRef.current = true;
	
	}}  disabled={0 == attributes.image.length?'disabled' : ''} > {__("Smart Tag",'pic-tage')} </Button> </span>
	<span style={{display:'inline-block',width:'25%'}} >
				<MediaUploadCheck>
					<MediaUpload
						onSelect={media => {
							setAttributes({ image: media.url })
							setAttributes({tags:[]})
							setAttributes({smartTag:false})
							tagRef.current = false;
							Array.from(imgRef.current.parentElement.querySelectorAll('.pic-tag-box')).map(x=>x.remove());
						}
					}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button style={{ border: '1px solid rgba(0,0,0,1)', float:"right",margin:"10px" }} onClick={open}>{ 0< attributes.image.length ? __('Change Image','pic-tag') :__('Select Image', 'pic-tag')}</Button>
						)}
					/>
				</MediaUploadCheck>
</span>

<span style={{width:'52%',marginLeft:'3%',display:'inline-block'}}>
<p style={{color:"rgba(0,0,0,1)",textAlign:'center',fontSize:'10px'}}> { __('Minimum confidence score', 'pic-tag')}</p>
<RangeControl


min= {0}
max= {100}
onChange = { val => setAttributes({ score: val })}
value = {attributes.score}
resetFallbackValue= {50}
/>

</span>
<i className = "dashicons-before dashicons-info-outline" style={{fontSize:'8px'}}>{__('Double click Tag name to rename it','pic-tag')}</i>
				</PanelBody>
					
			</div>
			
		</div>
	);
}
