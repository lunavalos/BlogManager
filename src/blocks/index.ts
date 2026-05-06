import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'text',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      localized: true,
    },
    {
      name: 'ctaLink',
      type: 'text',
    },
  ],
}

export const ContentBlock: Block = {
  slug: 'content',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

export const FeaturesBlock: Block = {
  slug: 'features',
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  fields: [
    {
      name: 'text',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      localized: true,
    },
    {
      name: 'buttonLink',
      type: 'text',
    },
  ],
}

export const BlogPreviewBlock: Block = {
  slug: 'blogPreview',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 10,
    },
  ],
}
