import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codegen } from '@sanity/codegen'

export default defineConfig({
  projectId: process.env.SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_DATASET || 'production',
  title: 'CVPM Enterprise CMS',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Properties')
              .icon(() => '🏠')
              .child(
                S.documentTypeList('property')
                  .title('Properties')
                  .filter('_type == "property"')
              ),
            S.listItem()
              .title('Bookings')
              .icon(() => '📅')
              .child(
                S.documentTypeList('booking')
                  .title('Bookings')
                  .filter('_type == "booking"')
              ),
            S.listItem()
              .title('Users')
              .icon(() => '👤')
              .child(
                S.documentTypeList('user')
                  .title('Users')
                  .filter('_type == "user"')
              ),
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(
                S.documentTypeList('page')
                  .title('Pages')
                  .filter('_type == "page"')
              ),
            S.listItem()
              .title('Settings')
              .icon(() => '⚙️')
              .child(
                S.documentTypeList('settings')
                  .title('Settings')
                  .filter('_type == "settings"')
              ),
          ]),
    }),
    visionTool(),
    codegen({
      path: './src/types/sanity.ts',
    }),
  ],
  schema: {
    types: [
      {
        name: 'property',
        title: 'Property',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required().min(3).max(100),
          },
          {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
              source: 'title',
              maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule) => Rule.required().min(10).max(500),
          },
          {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
              {
                type: 'image',
                options: {
                  hotspot: true,
                },
                fields: [
                  {
                    name: 'alt',
                    title: 'Alternative Text',
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                  },
                ],
              },
            ],
            validation: (Rule) => Rule.required().min(1),
          },
          {
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
          },
          {
            name: 'currency',
            title: 'Currency',
            type: 'string',
            options: {
              list: ['EUR', 'USD', 'GBP', 'MTL'],
            },
            initialValue: 'EUR',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'bedrooms',
            title: 'Bedrooms',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(20),
          },
          {
            name: 'bathrooms',
            title: 'Bathrooms',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(10),
          },
          {
            name: 'location',
            title: 'Location',
            type: 'object',
            fields: [
              {
                name: 'address',
                title: 'Address',
                type: 'string',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'city',
                title: 'City',
                type: 'string',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'country',
                title: 'Country',
                type: 'string',
                validation: (Rule) => Rule.required(),
              },
              {
                name: 'coordinates',
                title: 'Coordinates',
                type: 'geopoint',
              },
            ],
          },
          {
            name: 'amenities',
            title: 'Amenities',
            type: 'array',
            of: [
              {
                type: 'string',
              },
            ],
          },
          {
            name: 'availability',
            title: 'Availability',
            type: 'object',
            fields: [
              {
                name: 'available',
                title: 'Available',
                type: 'boolean',
                initialValue: true,
              },
              {
                name: 'checkIn',
                title: 'Check-in Time',
                type: 'string',
                initialValue: '15:00',
              },
              {
                name: 'checkOut',
                title: 'Check-out Time',
                type: 'string',
                initialValue: '11:00',
              },
              {
                name: 'blockedDates',
                title: 'Blocked Dates',
                type: 'array',
                of: [
                  {
                    type: 'date',
                  },
                ],
              },
            ],
          },
          {
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
              {
                name: 'metaTitle',
                title: 'Meta Title',
                type: 'string',
                validation: (Rule) => Rule.max(60),
              },
              {
                name: 'metaDescription',
                title: 'Meta Description',
                type: 'text',
                validation: (Rule) => Rule.max(160),
              },
              {
                name: 'keywords',
                title: 'Keywords',
                type: 'array',
                of: [
                  {
                    type: 'string',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'booking',
        title: 'Booking',
        type: 'document',
        fields: [
          {
            name: 'property',
            title: 'Property',
            type: 'reference',
            to: [{ type: 'property' }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'guest',
            title: 'Guest',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'checkIn',
            title: 'Check-in Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'checkOut',
            title: 'Check-out Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'guests',
            title: 'Number of Guests',
            type: 'number',
            validation: (Rule) => Rule.required().min(1),
          },
          {
            name: 'totalPrice',
            title: 'Total Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
          },
          {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
              list: ['pending', 'confirmed', 'cancelled', 'completed'],
            },
            initialValue: 'pending',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'payment',
            title: 'Payment',
            type: 'object',
            fields: [
              {
                name: 'status',
                title: 'Payment Status',
                type: 'string',
                options: {
                  list: ['pending', 'paid', 'refunded'],
                },
                initialValue: 'pending',
              },
              {
                name: 'method',
                title: 'Payment Method',
                type: 'string',
                options: {
                  list: ['stripe', 'paypal', 'bank_transfer'],
                },
              },
              {
                name: 'transactionId',
                title: 'Transaction ID',
                type: 'string',
              },
            ],
          },
        ],
      },
      {
        name: 'user',
        title: 'User',
        type: 'document',
        fields: [
          {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required().min(2).max(50),
          },
          {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email(),
          },
          {
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
              list: ['admin', 'owner', 'guest', 'agent'],
            },
            initialValue: 'guest',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'profile',
            title: 'Profile',
            type: 'object',
            fields: [
              {
                name: 'avatar',
                title: 'Avatar',
                type: 'image',
                options: {
                  hotspot: true,
                },
              },
              {
                name: 'phone',
                title: 'Phone',
                type: 'string',
              },
              {
                name: 'bio',
                title: 'Bio',
                type: 'text',
              },
              {
                name: 'preferences',
                title: 'Preferences',
                type: 'object',
                fields: [
                  {
                    name: 'language',
                    title: 'Language',
                    type: 'string',
                    initialValue: 'en',
                  },
                  {
                    name: 'currency',
                    title: 'Currency',
                    type: 'string',
                    initialValue: 'EUR',
                  },
                  {
                    name: 'notifications',
                    title: 'Notifications',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'page',
        title: 'Page',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
              source: 'title',
              maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
              {
                type: 'block',
              },
              {
                type: 'image',
                options: {
                  hotspot: true,
                },
              },
              {
                type: 'object',
                name: 'hero',
                title: 'Hero Section',
                fields: [
                  {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                  },
                  {
                    name: 'subtitle',
                    title: 'Subtitle',
                    type: 'text',
                  },
                  {
                    name: 'backgroundImage',
                    title: 'Background Image',
                    type: 'image',
                  },
                  {
                    name: 'cta',
                    title: 'Call to Action',
                    type: 'object',
                    fields: [
                      {
                        name: 'text',
                        title: 'Text',
                        type: 'string',
                      },
                      {
                        name: 'url',
                        title: 'URL',
                        type: 'url',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'seo',
            title: 'SEO',
            type: 'object',
            fields: [
              {
                name: 'metaTitle',
                title: 'Meta Title',
                type: 'string',
                validation: (Rule) => Rule.max(60),
              },
              {
                name: 'metaDescription',
                title: 'Meta Description',
                type: 'text',
                validation: (Rule) => Rule.max(160),
              },
            ],
          },
        ],
      },
      {
        name: 'settings',
        title: 'Settings',
        type: 'document',
        fields: [
          {
            name: 'siteName',
            title: 'Site Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'siteDescription',
            title: 'Site Description',
            type: 'text',
            validation: (Rule) => Rule.required(),
          },
          {
            name: 'logo',
            title: 'Logo',
            type: 'image',
          },
          {
            name: 'favicon',
            title: 'Favicon',
            type: 'image',
          },
          {
            name: 'contact',
            title: 'Contact Information',
            type: 'object',
            fields: [
              {
                name: 'email',
                title: 'Email',
                type: 'string',
                validation: (Rule) => Rule.required().email(),
              },
              {
                name: 'phone',
                title: 'Phone',
                type: 'string',
              },
              {
                name: 'address',
                title: 'Address',
                type: 'text',
              },
            ],
          },
          {
            name: 'social',
            title: 'Social Media',
            type: 'object',
            fields: [
              {
                name: 'facebook',
                title: 'Facebook',
                type: 'url',
              },
              {
                name: 'instagram',
                title: 'Instagram',
                type: 'url',
              },
              {
                name: 'twitter',
                title: 'Twitter',
                type: 'url',
              },
              {
                name: 'linkedin',
                title: 'LinkedIn',
                type: 'url',
              },
            ],
          },
        ],
      },
    ],
  },
})